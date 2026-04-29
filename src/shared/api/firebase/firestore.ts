import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./index";
import type { Chat } from "@/shared/types/chat";
import type { Message, MessageStatus } from "@/shared/types/message";
import type { User } from "@/shared/types/user";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";

export async function getUserById(userId: string): Promise<User | null> {
  if (!userId) return null;

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists()
      ? ({ id: userDoc.id, ...userDoc.data() } as User)
      : null;
  } catch {
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
): Promise<void> {
  if (!userId) throw new Error("userId is required");

  try {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      lastSeen: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

export async function setUserOnlineStatus(
  userId: string,
  isOnline: boolean,
): Promise<void> {
  if (!userId) return;

  try {
    await updateDoc(doc(db, "users", userId), {
      isOnline,
      lastSeen: serverTimestamp(),
    });
  } catch {}
}

export async function getOrCreateDirectChat(
  userId1: string,
  userId2: string,
): Promise<string> {
  if (!userId1 || !userId2) throw new Error("Both user IDs are required");
  if (userId1 === userId2) throw new Error("Cannot create chat with self");

  try {
    const participants = [userId1, userId2].sort();
    const q = query(
      collection(db, "chats"),
      where("type", "==", "direct"),
      where("participants", "==", participants),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty && snapshot.docs[0]) {
      return snapshot.docs[0].id;
    }

    const chatRef = await addDoc(collection(db, "chats"), {
      type: "direct",
      participants,
      lastMessage: {
        text: "",
        senderId: "",
        createdAt: serverTimestamp(),
      },
      createdBy: userId1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await Promise.all([
      setDoc(doc(db, "chats", chatRef.id, "members", userId1), {
        userId: userId1,
        unreadCount: 0,
        joinedAt: serverTimestamp(),
      }),
      setDoc(doc(db, "chats", chatRef.id, "members", userId2), {
        userId: userId2,
        unreadCount: 0,
        joinedAt: serverTimestamp(),
      }),
    ]);

    return chatRef.id;
  } catch (error) {
    throw error;
  }
}

export function subscribeToUserChats(
  userId: string,
  callback: (chats: Chat[]) => void,
): Unsubscribe {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      callback(chats);
    },
    () => {
      callback([]);
    },
  );
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
): Promise<string> {
  if (!chatId || !senderId || !text?.trim())
    throw new Error("Invalid message parameters");

  const sanitizedText = sanitizeText(text, {
    allowBasicHtml: false,
    maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    stripNewlines: false,
    normalizeSpaces: true,
  });

  if (sanitizedText.length === 0) throw new Error("Message cannot be empty");

  try {
    const messageData = {
      chatId,
      senderId,
      type: "text" as const,
      text: sanitizedText,
      isEdited: false,
      isDeleted: false,
      createdAt: serverTimestamp(),
    };
    const messageRef = await addDoc(
      collection(db, "chats", chatId, "messages"),
      messageData,
    );
    const messageId = messageRef.id;
    const chatDoc = await getDoc(doc(db, "chats", chatId));

    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      const participants = chatData.participants || [];
      const tasks = participants
        .filter((participantId) => participantId !== senderId)
        .map(async (participantId) => {
          try {
            await setMessageDeliveryStatus(
              messageId,
              chatId,
              participantId,
              "sent",
            );
            await incrementUnreadCount(chatId, participantId);
          } catch {}
        });

      await Promise.allSettled(tasks);
    }

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: {
        text: sanitizedText,
        senderId,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });

    return messageId;
  } catch (error) {
    throw error;
  }
}

export async function searchUsers(
  searchTerm: string,
  limitCount: number = 50,
): Promise<User[]> {
  if (!searchTerm?.trim() || searchTerm.length < 2) return [];

  try {
    const term = searchTerm.toLowerCase().trim();
    const usersRef = collection(db, "users");

    const qEmail = query(
      usersRef,
      where("email", ">=", term),
      where("email", "<=", term + "\uf8ff"),
      limit(limitCount),
    );

    const qName = query(
      usersRef,
      where("displayName", ">=", searchTerm),
      where("displayName", "<=", searchTerm + "\uf8ff"),
      limit(limitCount),
    );

    const [emailSnap, nameSnap] = await Promise.all([
      getDocs(qEmail),
      getDocs(qName),
    ]);

    const userMap = new Map<string, User>();

    const processDocs = (snap: QuerySnapshot<DocumentData, DocumentData>) => {
      snap.docs.forEach((doc) => {
        const data = doc.data() as User;

        const isValid =
          data.displayName && data.email && (data.createdAt || data.lastSeen);

        if (isValid) {
          const emailKey = data.email.toLowerCase().trim();
          const existing = userMap.get(emailKey);

          if (!existing || (!existing.photoURL && data.photoURL)) {
            userMap.set(emailKey, { id: doc.id, ...data } as User);
          }
        }
      });
    };

    processDocs(emailSnap);
    processDocs(nameSnap);

    return Array.from(userMap.values())
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .slice(0, limitCount);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export function subscribeToChatMessages(
  chatId: string,
  callback: (messages: Message[]) => void,
  currentUserId?: string,
): Unsubscribe {
  if (!chatId) {
    callback([]);
    return () => {};
  }

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(100));

  return onSnapshot(
    q,
    async (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            chatId: data.chatId || chatId,
            senderId: data.senderId || "",
            type: (data.type || "text") as Message["type"],
            text: data.text || "",
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null,
            isEdited: data.isEdited ?? false,
            isDeleted: data.isDeleted ?? false,
            deletedAt: data.deletedAt || null,
            deletedBy: data.deletedBy || null,
            replyToMessageId: data.replyToMessageId || null,
            attachments: data.attachments || null,
            systemData: data.systemData || null,
          } as Message;
        })
        .reverse();

      let filteredMessages = messages;

      if (currentUserId) {
        const deletedChecks = await Promise.allSettled(
          messages.map(async (message) => {
            const deletedRef = doc(
              db,
              "chats",
              chatId,
              "messages",
              message.id,
              "deletedFor",
              currentUserId,
            );
            const deletedDoc = await getDoc(deletedRef);
            return {
              messageId: message.id,
              isDeleted: deletedDoc.exists(),
            };
          }),
        );

        const deletedSet = new Set<string>();

        deletedChecks.forEach((result) => {
          if (result.status === "fulfilled" && result.value.isDeleted) {
            deletedSet.add(result.value.messageId);
          }
        });

        filteredMessages = messages.filter((msg) => !deletedSet.has(msg.id));

        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const messageData = change.doc.data();
            const messageId = change.doc.id;
            const senderId = messageData.senderId as string;

            if (senderId && senderId !== currentUserId) {
              setMessageDeliveryStatus(
                messageId,
                chatId,
                currentUserId,
                "delivered",
              );
            }
          }
        });
      }

      callback(filteredMessages);
    },
    () => {
      callback([]);
    },
  );
}

export function subscribeToUser(
  userId: string,
  callback: (user: User | null) => void,
): Unsubscribe {
  if (!userId) {
    callback(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", userId),
    (userDoc) => {
      if (userDoc.exists()) {
        callback({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        callback(null);
      }
    },
    () => {
      callback(null);
    },
  );
}

export async function setTypingStatus(
  chatId: string,
  userId: string,
  isTyping: boolean,
): Promise<void> {
  if (!chatId || !userId) return;

  const typingRef = doc(db, "chats", chatId, "typing", userId);

  try {
    if (isTyping) {
      await setDoc(typingRef, {
        userId,
        startedAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(typingRef);
    }
  } catch {}
}

export function subscribeToTyping(
  chatId: string,
  callback: (typingUsers: string[]) => void,
): Unsubscribe {
  if (!chatId) {
    callback([]);
    return () => {};
  }

  const typingRef = collection(db, "chats", chatId, "typing");

  return onSnapshot(
    typingRef,
    (snapshot) => {
      const typingUsers = snapshot.docs
        .map((doc) => doc.data().userId as string)
        .filter(Boolean);
      callback(typingUsers);
    },
    () => {
      callback([]);
    },
  );
}

export async function markChatAsRead(
  chatId: string,
  userId: string,
  lastMessageId?: string,
): Promise<void> {
  if (!chatId || !userId) return;

  try {
    const chatMemberRef = doc(db, "chats", chatId, "members", userId);
    const updateData: Record<string, string | Timestamp | number> = {
      lastReadAt: serverTimestamp() as Timestamp,
      unreadCount: 0,
    };

    if (lastMessageId) {
      updateData.lastReadMessageId = lastMessageId;
    }

    await setDoc(
      chatMemberRef,
      {
        userId,
        ...updateData,
      },
      { merge: true },
    );
  } catch {}
}

export async function incrementUnreadCount(
  chatId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !userId) return;

  try {
    const chatMemberRef = doc(db, "chats", chatId, "members", userId);
    const chatMemberDoc = await getDoc(chatMemberRef);

    if (chatMemberDoc.exists()) {
      const currentCount = (chatMemberDoc.data().unreadCount || 0) as number;
      await updateDoc(chatMemberRef, {
        unreadCount: currentCount + 1,
      });
    } else {
      await setDoc(chatMemberRef, {
        userId,
        unreadCount: 1,
        joinedAt: serverTimestamp(),
      });
    }
  } catch {}
}

export function subscribeToChatMember(
  chatId: string,
  userId: string,
  callback: (unreadCount: number) => void,
): Unsubscribe {
  if (!chatId || !userId) {
    callback(0);
    return () => {};
  }

  const chatMemberRef = doc(db, "chats", chatId, "members", userId);

  return onSnapshot(
    chatMemberRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback((data.unreadCount || 0) as number);
      } else {
        callback(0);
      }
    },
    () => {
      callback(0);
    },
  );
}

export async function setMessageDeliveryStatus(
  messageId: string,
  chatId: string,
  userId: string,
  status: MessageStatus,
): Promise<void> {
  if (!messageId || !chatId || !userId) return;

  try {
    const statusRef = doc(
      db,
      "chats",
      chatId,
      "messages",
      messageId,
      "deliveryStatus",
      userId,
    );
    const statusData: Record<string, string | Timestamp> = {
      messageId,
      chatId,
      userId,
      status,
    };

    if (status === "delivered") {
      statusData.deliveredAt = serverTimestamp() as Timestamp;
    } else if (status === "read") {
      statusData.readAt = serverTimestamp() as Timestamp;
      statusData.deliveredAt = serverTimestamp() as Timestamp;
    }

    await setDoc(statusRef, statusData, { merge: true });
  } catch {}
}

export function subscribeToMessageDeliveryStatus(
  messageId: string,
  chatId: string,
  userId: string,
  callback: (status: MessageStatus | null) => void,
): Unsubscribe {
  if (!messageId || !chatId || !userId) {
    callback(null);
    return () => {};
  }

  const statusRef = doc(
    db,
    "chats",
    chatId,
    "messages",
    messageId,
    "deliveryStatus",
    userId,
  );

  return onSnapshot(
    statusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback((data.status || "sent") as MessageStatus);
      } else {
        callback(null);
      }
    },
    () => {
      callback(null);
    },
  );
}

export async function editMessage(
  chatId: string,
  messageId: string,
  text: string,
  userId: string,
): Promise<void> {
  if (!chatId || !messageId || !text?.trim() || !userId)
    throw new Error("Invalid edit parameters");

  const sanitizedText = sanitizeText(text, {
    allowBasicHtml: false,
    maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    stripNewlines: false,
    normalizeSpaces: true,
  });

  if (sanitizedText.length === 0) throw new Error("Message cannot be empty");

  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageDoc = await getDoc(messageRef);

    if (!messageDoc.exists()) throw new Error("Message not found");

    const messageData = messageDoc.data();
    if (messageData.senderId !== userId) throw new Error("Unauthorized");
    if (messageData.isDeleted) throw new Error("Cannot edit deleted message");

    await updateDoc(messageRef, {
      text: sanitizedText,
      isEdited: true,
      updatedAt: serverTimestamp(),
    });

    const chatDoc = await getDoc(doc(db, "chats", chatId));
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      if (chatData.lastMessage?.senderId === userId) {
        await updateDoc(doc(db, "chats", chatId), {
          "lastMessage.text": sanitizedText,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteMessageForMe(
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !messageId || !userId)
    throw new Error("Invalid delete parameters");

  try {
    const deletedRef = doc(
      db,
      "chats",
      chatId,
      "messages",
      messageId,
      "deletedFor",
      userId,
    );
    await setDoc(deletedRef, {
      userId,
      deletedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteMessageForAll(
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !messageId || !userId)
    throw new Error("Invalid delete parameters");

  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageDoc = await getDoc(messageRef);

    if (!messageDoc.exists()) throw new Error("Message not found");

    const messageData = messageDoc.data();
    if (messageData.senderId !== userId) throw new Error("Unauthorized");

    await updateDoc(messageRef, {
      isDeleted: true,
      text: "Сообщение удалено",
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });

    const chatDoc = await getDoc(doc(db, "chats", chatId));
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      if (chatData.lastMessage?.senderId === userId) {
        await updateDoc(doc(db, "chats", chatId), {
          "lastMessage.text": "Сообщение удалено",
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    throw error;
  }
}

export function subscribeToMessageDeletedForUser(
  chatId: string,
  messageId: string,
  userId: string,
  callback: (isDeleted: boolean) => void,
): Unsubscribe {
  if (!chatId || !messageId || !userId) {
    callback(false);
    return () => {};
  }

  const deletedRef = doc(
    db,
    "chats",
    chatId,
    "messages",
    messageId,
    "deletedFor",
    userId,
  );

  return onSnapshot(
    deletedRef,
    (snapshot) => {
      callback(snapshot.exists());
    },
    () => {
      callback(false);
    },
  );
}
