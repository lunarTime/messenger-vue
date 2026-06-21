import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  arrayRemove,
  serverTimestamp,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
  type Timestamp,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QueryConstraint,
  arrayUnion,
  increment,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "./index";
import type { Chat, ChatMemberRole } from "@/shared/types/chat";
import type {
  Message,
  MessageAttachment,
  SystemMessageEventType,
  SystemMessageData,
  SendMessageOptions,
} from "@/shared/types/message";
import { lastMessageText as formatLastMessageText } from "@/shared/lib/message/attachmentText";
import type { User } from "@/shared/types/user";
import { sanitizeText } from "@/shared/lib/sanitization/sanitizer";
import { VALIDATION_CONFIG } from "@/shared/config/validation.config";

export function subscribeToChatMembers(
  chatId: string,
  callback: (members: { userId: string; role: ChatMemberRole }[]) => void,
): Unsubscribe {
  if (!chatId) {
    callback([]);
    return () => {};
  }

  const membersRef = collection(db, "chats", chatId, "members");

  return onSnapshot(
    membersRef,
    (snapshot) => {
      const members = snapshot.docs.map((doc) => ({
        userId: doc.id,
        role: (doc.data().role as ChatMemberRole) || "member",
      }));
      callback(members);
    },
    () => callback([]),
  );
}

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

export async function getUserByIdFromServer(
  userId: string,
): Promise<User | null> {
  if (!userId) return null;

  try {
    const userDoc = await getDocFromServer(doc(db, "users", userId));

    return userDoc.exists()
      ? ({ id: userDoc.id, ...userDoc.data() } as User)
      : null;
  } catch {
    return null;
  }
}

export function subscribeToChatMeta(
  chatId: string,
  callback: (meta: { clearedAtForAll: Timestamp | null }) => void,
): Unsubscribe {
  if (!chatId) {
    callback({ clearedAtForAll: null });
    return () => {};
  }

  return onSnapshot(
    doc(db, "chats", chatId),
    (snap) => {
      if (!snap.exists()) {
        callback({ clearedAtForAll: null });
        return;
      }
      const data = snap.data();
      callback({
        clearedAtForAll: (data.clearedAtForAll as Timestamp) || null,
      });
    },
    () => callback({ clearedAtForAll: null }),
  );
}

export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
): Promise<void> {
  if (!userId) throw new Error("userId is required");

  await updateDoc(doc(db, "users", userId), {
    ...data,
    lastSeen: serverTimestamp(),
  });
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
  } catch {
    return;
  }
}

export async function setChatMuted(
  userId: string,
  chatId: string,
  isMuted: boolean,
): Promise<void> {
  if (!userId || !chatId) throw new Error("Invalid parameters");

  await setDoc(
    doc(db, "users", userId),
    {
      mutedChats: isMuted ? arrayUnion(chatId) : arrayRemove(chatId),
    },
    { merge: true },
  );
}

export async function getOrCreateDirectChat(
  userId1: string,
  userId2: string,
): Promise<string> {
  if (!userId1 || !userId2) throw new Error("Both user IDs are required");
  if (userId1 === userId2) throw new Error("Cannot create chat with self");

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
        isPinned: false,
        joinedAt: serverTimestamp(),
      }),
      setDoc(doc(db, "chats", chatRef.id, "members", userId2), {
        userId: userId2,
        unreadCount: 0,
        isPinned: false,
        joinedAt: serverTimestamp(),
      }),
    ]);

  return chatRef.id;
}

export async function sendSystemMessage(
  chatId: string,
  eventType: SystemMessageEventType,
  actorId: string,
  targetUserIds?: string[],
  extraData?: Partial<SystemMessageData>,
): Promise<string> {
  try {
    const [actorUser, ...targetUsers] = await Promise.all([
      getUserById(actorId),
      ...(targetUserIds ?? []).map((id) => getUserById(id)),
    ]);

    const systemData: SystemMessageData = {
      eventType,
      actorId,
      actorName: actorUser?.displayName ?? "",
      ...(targetUserIds && targetUserIds.length > 0
        ? {
            targetUserIds,
            targetUserNames: targetUsers.map((u) => u?.displayName ?? ""),
          }
        : {}),
      ...extraData,
    };

    const messageData = {
      chatId,
      senderId: "system",
      type: "system" as const,
      text: "",
      systemData,
      isEdited: false,
      isDeleted: false,
      createdAt: serverTimestamp(),
    };

    const messageRef = await addDoc(
      collection(db, "chats", chatId, "messages"),
      messageData,
    );

    await updateDoc(doc(db, "chats", chatId), {
      updatedAt: serverTimestamp(),
      "lastMessage.text": "Системное сообщение",
      "lastMessage.senderId": "system",
      "lastMessage.createdAt": serverTimestamp(),
    });

    const chatDoc = await getDoc(doc(db, "chats", chatId));

    if (chatDoc.exists()) {
      const participants = (chatDoc.data() as Chat).participants || [];
      const tasks = participants
        .filter((id) => id !== actorId)
        .map((id) => incrementUnreadCount(chatId, id));
      await Promise.allSettled(tasks);
    }

    return messageRef.id;
  } catch (error) {
    console.error("Failed to send system message:", error);
    throw error;
  }
}

export async function createGroupChat(
  creatorId: string,
  name: string,
  participants: string[],
  photoURL?: string,
): Promise<string> {
  if (!creatorId || !name || !participants.length)
    throw new Error("Invalid parameters");

  const allParticipants = Array.from(new Set([...participants, creatorId]));

  const chatRef = await addDoc(collection(db, "chats"), {
    type: "group",
    name,
    photoURL: photoURL || null,
    participants: allParticipants,
    createdBy: creatorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: {
      text: "Группа создана",
      senderId: "system",
      createdAt: serverTimestamp(),
    },
  });

  const memberTasks = allParticipants.map((userId) => {
    return setDoc(doc(db, "chats", chatRef.id, "members", userId), {
      userId,
      role: userId === creatorId ? "owner" : "member",
      unreadCount: 0,
      isPinned: false,
      joinedAt: serverTimestamp(),
    });
  });

  await Promise.all(memberTasks);

  await sendSystemMessage(chatRef.id, "chat_created", creatorId, [], {
    newValue: name,
  });

  return chatRef.id;
}

export async function updateGroupInfo(
  chatId: string,
  actorId: string,
  updates: { name?: string; photoURL?: string; description?: string },
): Promise<void> {
  if (!chatId || !actorId) throw new Error("Invalid parameters");

  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (!chatDoc.exists()) throw new Error("Chat not found");

  const oldData = chatDoc.data() as Chat;
  await updateDoc(doc(db, "chats", chatId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (updates.name && updates.name !== oldData.name) {
    await sendSystemMessage(chatId, "chat_name_changed", actorId, [], {
      oldValue: oldData.name,
      newValue: updates.name,
    });
  }

  if (updates.photoURL !== undefined && updates.photoURL !== oldData.photoURL) {
    await sendSystemMessage(chatId, "chat_photo_changed", actorId, [], {
      oldValue: oldData.photoURL,
      newValue: updates.photoURL,
    });
  }
}

export async function deleteGroupChat(chatId: string): Promise<void> {
  if (!chatId) throw new Error("chatId is required");
  await deleteDoc(doc(db, "chats", chatId));
}

export interface ChatMemberMeta {
  exists: boolean;
  isPinned: boolean;
  pinnedOrder: number | null;
  clearedAt: Timestamp | null;
  hiddenAt: Timestamp | null;
  role: ChatMemberRole;
  unreadCount: number;
}

export type ChatMemberMetaSnapshot = ChatMemberMeta & {
  fromCache: boolean;
  hasPendingWrites: boolean;
};

const EMPTY_MEMBER_META: ChatMemberMeta = {
  exists: false,
  isPinned: false,
  pinnedOrder: null,
  clearedAt: null,
  hiddenAt: null,
  role: "member",
  unreadCount: 0,
};

function mapMemberMetaSnap(snap: DocumentSnapshot): ChatMemberMeta {
  if (!snap.exists()) {
    return EMPTY_MEMBER_META;
  }

  const data = snap.data();

  return {
    exists: true,
    isPinned: Boolean(data.isPinned),
    pinnedOrder:
      typeof data.pinnedOrder === "number"
        ? (data.pinnedOrder as number)
        : null,
    clearedAt: (data.clearedAt as Timestamp) || null,
    hiddenAt: (data.hiddenAt as Timestamp) || null,
    role: (data.role as ChatMemberRole) || "member",
    unreadCount: (data.unreadCount as number) || 0,
  };
}

export async function getChatMemberMetaFromServer(
  chatId: string,
  userId: string,
): Promise<ChatMemberMeta> {
  if (!chatId || !userId) {
    return EMPTY_MEMBER_META;
  }

  const snap = await getDocFromServer(
    doc(db, "chats", chatId, "members", userId),
  );

  return mapMemberMetaSnap(snap);
}

export function subscribeToChatMemberMeta(
  chatId: string,
  userId: string,
  callback: (meta: ChatMemberMetaSnapshot) => void,
): Unsubscribe {
  if (!chatId || !userId) {
    callback({
      ...EMPTY_MEMBER_META,
      fromCache: false,
      hasPendingWrites: false,
    });
    return () => {};
  }

  const ref = doc(db, "chats", chatId, "members", userId);

  return onSnapshot(
    ref,
    (snap) => {
      const fromCache = snap.metadata.fromCache;
      const hasPendingWrites = snap.metadata.hasPendingWrites;

      if (!snap.exists()) {
        callback({
          ...EMPTY_MEMBER_META,
          fromCache,
          hasPendingWrites,
        });
        return;
      }

      const data = snap.data();

      callback({
        exists: true,
        isPinned: Boolean(data.isPinned),
        pinnedOrder:
          typeof data.pinnedOrder === "number"
            ? (data.pinnedOrder as number)
            : null,
        clearedAt: (data.clearedAt as Timestamp) || null,
        hiddenAt: (data.hiddenAt as Timestamp) || null,
        role: (data.role as ChatMemberRole) || "member",
        unreadCount: (data.unreadCount as number) || 0,
        fromCache,
        hasPendingWrites,
      });
    },
    () =>
      callback({
        ...EMPTY_MEMBER_META,
        fromCache: false,
        hasPendingWrites: false,
      }),
  );
}

export async function setChatPinned(
  chatId: string,
  userId: string,
  isPinned: boolean,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");

  const memberRef = doc(db, "chats", chatId, "members", userId);

  if (isPinned) {
    await setDoc(
      memberRef,
      {
        userId,
        isPinned: true,
        pinnedAt: serverTimestamp() as Timestamp,
      },
      { merge: true },
    );
    return;
  }

  await setDoc(
    memberRef,
    {
      userId,
      isPinned: false,
      pinnedAt: null,
      pinnedOrder: null,
    },
    { merge: true },
  );
}

export async function setChatPinnedOrder(
  chatId: string,
  userId: string,
  pinnedOrder: number,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");
  if (!Number.isFinite(pinnedOrder)) throw new Error("Invalid pinnedOrder");

  await setDoc(
    doc(db, "chats", chatId, "members", userId),
    { userId, pinnedOrder },
    { merge: true },
  );
}

export async function addGroupMembers(
  chatId: string,
  userIds: string[],
  addedBy: string,
): Promise<void> {
  if (!chatId || !userIds.length) return;

  await updateDoc(doc(db, "chats", chatId), {
    participants: arrayUnion(...userIds),
    updatedAt: serverTimestamp(),
  });

  const memberTasks = userIds.map((userId) => {
    return setDoc(
      doc(db, "chats", chatId, "members", userId),
      {
        userId,
        role: "member",
        joinedAt: serverTimestamp(),
        addedBy,
        unreadCount: 0,
        isPinned: false,
      },
      { merge: true },
    );
  });

  await Promise.all(memberTasks);

  await sendSystemMessage(chatId, "user_added", addedBy, userIds);
}

export async function setMemberRole(
  chatId: string,
  userId: string,
  role: ChatMemberRole,
  actorId?: string,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");

  await updateDoc(doc(db, "chats", chatId, "members", userId), { role });

  if (actorId) {
    const eventType =
      role === "admin" ? "user_promoted_to_admin" : "user_demoted_from_admin";
    try {
      await sendSystemMessage(chatId, eventType, actorId, [userId]);
    } catch (err) {
      console.error(
        "Non-critical: failed to send role change system message",
        err,
      );
    }
  }
}

export async function removeGroupMember(
  chatId: string,
  userId: string,
  removedBy: string,
): Promise<void> {
  if (!chatId || !userId || !removedBy) throw new Error("Invalid parameters");

  try {
    await sendSystemMessage(chatId, "user_removed", removedBy, [userId]);
  } catch (err) {
    console.error("Non-critical: failed to send removal system message", err);
  }

  await updateDoc(doc(db, "chats", chatId), {
    participants: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });

  await deleteDoc(doc(db, "chats", chatId, "members", userId));
}

export async function leaveChat(
  chatId: string,
  userId: string,
  isGroup: boolean = false,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");

  if (isGroup) {
    await sendSystemMessage(chatId, "user_left", userId);

    await Promise.all([
      updateDoc(doc(db, "chats", chatId), {
        participants: arrayRemove(userId),
        updatedAt: serverTimestamp(),
      }),
      deleteDoc(doc(db, "chats", chatId, "members", userId)),
    ]);
    return;
  }

  await setDoc(
    doc(db, "chats", chatId, "members", userId),
    {
      userId,
      hiddenAt: serverTimestamp(),
      clearedAt: serverTimestamp(),
      unreadCount: 0,
    },
    { merge: true },
  );
}

export async function clearChatHistoryForMe(
  chatId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");

  await setDoc(
    doc(db, "chats", chatId, "members", userId),
    {
      userId,
      clearedAt: serverTimestamp(),
      unreadCount: 0,
    },
    { merge: true },
  );
}

async function recomputeChatLastMessage(chatId: string): Promise<void> {
  const recentQuery = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(recentQuery);

  const lastAlive = snapshot.docs.find((d) => !d.data().isDeleted);

  if (!lastAlive) {
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: null,
    });
    return;
  }

  const data = lastAlive.data();
  const isSystem = data.type === "system";
  const text = isSystem
    ? "Системное сообщение"
    : formatLastMessageText(
        (data.text as string) ?? "",
        data.attachments as MessageAttachment[] | undefined,
      );

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: {
      id: lastAlive.id,
      text,
      senderId: data.senderId,
      createdAt: data.createdAt,
    },
    updatedAt: data.createdAt,
  });
}

type LastMessageAfterDeletion = {
  isTargetLast: boolean;
  replacement: Chat["lastMessage"] | null;
};

async function getLastMessageAfterDeletion(
  chatId: string,
  targetMessageId: string,
): Promise<LastMessageAfterDeletion> {
  let cursor: QueryDocumentSnapshot<DocumentData> | null = null;
  let targetIsLast = false;

  while (true) {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (cursor) constraints.push(startAfter(cursor));

    constraints.push(limit(50));

    const snapshot = await getDocsFromServer(
      query(collection(db, "chats", chatId, "messages"), ...constraints),
    );

    for (const messageDoc of snapshot.docs) {
      const data = messageDoc.data();

      if (data.isDeleted) continue;

      if (!targetIsLast) {
        if (messageDoc.id !== targetMessageId) {
          return { isTargetLast: false, replacement: null };
        }

        targetIsLast = true;
        continue;
      }

      const text =
        data.type === "system"
          ? "Системное сообщение"
          : formatLastMessageText(
              (data.text as string) ?? "",
              data.attachments as MessageAttachment[] | undefined,
            );

      return {
        isTargetLast: true,
        replacement: {
          id: messageDoc.id,
          text,
          senderId: data.senderId,
          createdAt: data.createdAt,
        },
      };
    }

    if (snapshot.size < 50) {
      return { isTargetLast: targetIsLast, replacement: null };
    }

    cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
  }
}

export async function clearChatHistoryForAll(
  chatId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !userId) throw new Error("Invalid parameters");

  const myMessagesQuery = query(
    collection(db, "chats", chatId, "messages"),
    where("senderId", "==", userId),
  );
  const snapshot = await getDocs(myMessagesQuery);
  const aliveDocs = snapshot.docs.filter((d) => !d.data().isDeleted);

  const CHUNK = 400;

  for (let i = 0; i < aliveDocs.length; i += CHUNK) {
    const batch = writeBatch(db);

    for (const docSnap of aliveDocs.slice(i, i + CHUNK)) {
      batch.update(docSnap.ref, {
        isDeleted: true,
        text: "Сообщение удалено",
        deletedAt: serverTimestamp(),
        deletedBy: userId,
      });
    }

    await batch.commit();
  }

  await recomputeChatLastMessage(chatId);
}

function mapChatDocs(docs: QueryDocumentSnapshot<DocumentData>[]): Chat[] {
  return docs.map((chatDoc) => {
    const data = chatDoc.data({ serverTimestamps: "estimate" });

    return {
      id: chatDoc.id,
      participants: data.participants ?? [],
      type: data.type ?? "direct",
      name: data.name ?? null,
      photoURL: data.photoURL ?? null,
      createdBy: data.createdBy ?? null,
      adminIds: data.adminIds ?? null,
      updatedAt: data.updatedAt ?? null,
      lastMessage: data.lastMessage ?? null,
      createdAt: data.createdAt ?? null,
    } as Chat;
  });
}

function buildUserChatsQuery(userId: string) {
  return query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc"),
  );
}

export async function getUserChatsFromServer(userId: string): Promise<Chat[]> {
  if (!userId) return [];

  const snapshot = await getDocsFromServer(buildUserChatsQuery(userId));

  return mapChatDocs(snapshot.docs).filter((chat) =>
    chat.participants.includes(userId),
  );
}

export type UserChatsSnapshotMeta = {
  fromCache: boolean;
  hasPendingWrites: boolean;
};

export function subscribeToUserChats(
  userId: string,
  callback: (chats: Chat[], meta: UserChatsSnapshotMeta) => void,
): Unsubscribe {
  if (!userId) {
    callback([], { fromCache: false, hasPendingWrites: false });
    return () => {};
  }

  return onSnapshot(
    buildUserChatsQuery(userId),
    (snapshot) => {
      const chats = mapChatDocs(snapshot.docs).filter((chat) =>
        chat.participants.includes(userId),
      );

      callback(chats, {
        fromCache: snapshot.metadata.fromCache,
        hasPendingWrites: snapshot.metadata.hasPendingWrites,
      });
    },
    () => {
      callback([], { fromCache: false, hasPendingWrites: false });
    },
  );
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  options: SendMessageOptions = {},
): Promise<string> {
  const hasAttachments = options.attachments && options.attachments.length > 0;

  if (!chatId || !senderId || (!text?.trim() && !hasAttachments))
    throw new Error("Invalid message parameters");

  const sanitizedText = text?.trim()
    ? sanitizeText(text, {
        allowBasicHtml: false,
        maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
        stripNewlines: false,
        normalizeSpaces: true,
      })
    : "";

  const messageData: Record<string, unknown> = {
    chatId,
    senderId,
    type: "text" as const,
    text: sanitizedText,
    isEdited: false,
    isDeleted: false,
    createdAt: serverTimestamp(),
  };

  if (options.replyToMessageId) {
    messageData.replyToMessageId = options.replyToMessageId;
  }

  if (options.forwardedFrom) {
    messageData.forwardedFrom = options.forwardedFrom;
  }

  if (hasAttachments) {
    messageData.attachments = options.attachments;
  }

  const messageRef = doc(collection(db, "chats", chatId, "messages"));
  const messageId = messageRef.id;
  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (!chatDoc.exists()) throw new Error("Chat not found");

  const participants = (chatDoc.data() as Chat).participants || [];

  if (!participants.includes(senderId)) throw new Error("Sender is not a member");

  const otherParticipants = participants.filter(
    (participantId) => participantId !== senderId,
  );

  if (otherParticipants.length > 498) throw new Error("Too many participants");

  const lastMessageText = formatLastMessageText(
    sanitizedText,
    options.attachments,
  );

  const batch = writeBatch(db);

  batch.set(messageRef, messageData);
  batch.update(chatRef, {
    lastMessage: {
      id: messageId,
      text: lastMessageText,
      senderId,
      createdAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  otherParticipants.forEach((participantId) => {
    batch.set(
      doc(db, "chats", chatId, "members", participantId),
      {
        unreadCount: increment(1),
        lastMessageAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();

  return messageId;
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
        const data = doc.data();

        const isValid =
          data.displayName && data.email && (data.createdAt || data.lastSeen);

        if (isValid) {
          const emailKey = data.email.toLowerCase().trim();
          const existing = userMap.get(emailKey);

          if (!existing || (!existing.photoURL && data.photoURL)) {
            userMap.set(emailKey, { ...data, id: doc.id } as User);
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

function parseMessageDoc(docSnap: DocumentSnapshot, chatId: string): Message {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
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
    forwardedFrom: data.forwardedFrom || null,
    attachments: data.attachments || null,
    systemData: data.systemData || null,
  } as Message;
}

export interface ChatMessagesResult {
  messages: Message[];
  oldestCursor: DocumentSnapshot | null;
  hasMore: boolean;
}

export function subscribeToChatMessages(
  chatId: string,
  callback: (result: ChatMessagesResult) => void,
  currentUserId?: string,
  clearedAtMillis?: number | null,
): Unsubscribe {
  if (!chatId) {
    callback({ messages: [], oldestCursor: null, hasMore: false });
    return () => {};
  }

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs;
      const messages = docs.map((d) => parseMessageDoc(d, chatId)).reverse();
      const oldestCursor: DocumentSnapshot | null =
        docs.length > 0 ? docs[docs.length - 1]! : null;
      const hasMore = docs.length === 50;

      const docDataMap = new Map(docs.map((d) => [d.id, d.data()]));
      const filtered = messages.filter((msg) => {
        if (msg.isDeleted) return false;

        if (
          clearedAtMillis &&
          msg.createdAt &&
          msg.createdAt.toMillis() <= clearedAtMillis
        ) {
          return false;
        }

        if (!currentUserId) return true;

        const data = docDataMap.get(msg.id);

        if (!data) return true;

        const deletedForArray: string[] = data.deletedFor ?? [];
        return !deletedForArray.includes(currentUserId);
      });

      callback({ messages: filtered, oldestCursor, hasMore });
    },
    () => {
      callback({ messages: [], oldestCursor: null, hasMore: false });
    },
  );
}

export async function loadOlderMessages(
  chatId: string,
  cursor: DocumentSnapshot,
  currentUserId?: string,
  clearedAtMillis?: number | null,
): Promise<{ messages: Message[]; nextCursor: DocumentSnapshot | null }> {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(
    messagesRef,
    orderBy("createdAt", "desc"),
    startAfter(cursor),
    limit(50),
  );
  const snapshot = await getDocs(q);

  let messages = snapshot.docs.map((d) => parseMessageDoc(d, chatId)).reverse();

  messages = messages.filter((msg) => {
    if (msg.isDeleted) return false;

    if (
      clearedAtMillis &&
      msg.createdAt &&
      msg.createdAt.toMillis() <= clearedAtMillis
    ) {
      return false;
    }

    if (!currentUserId) return true;

    const data = snapshot.docs.find((d) => d.id === msg.id)?.data();
    if (!data) return true;

    const deletedForArray: string[] = data.deletedFor ?? [];
    return !deletedForArray.includes(currentUserId);
  });

  const nextCursor =
    snapshot.docs.length === 50
      ? snapshot.docs[snapshot.docs.length - 1]
      : null;

  return { messages, nextCursor: nextCursor ?? null };
}

export type UserSnapshotMeta = {
  fromCache: boolean;
};

export function subscribeToUser(
  userId: string,
  callback: (user: User | null, meta?: UserSnapshotMeta) => void,
): Unsubscribe {
  if (!userId) {
    callback(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", userId),
    (userDoc) => {
      const fromCache = userDoc.metadata.fromCache;

      if (userDoc.exists()) {
        callback({ id: userDoc.id, ...userDoc.data() } as User, { fromCache });
      } else {
        callback(null, { fromCache });
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
  } catch {
    return;
  }
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
  } catch {
    return;
  }
}

export async function incrementUnreadCount(
  chatId: string,
  userId: string,
  amount = 1,
): Promise<void> {
  if (!chatId || !userId || amount < 1) return;

  try {
    const chatMemberRef = doc(db, "chats", chatId, "members", userId);
    await setDoc(
      chatMemberRef,
      {
        unreadCount: increment(amount),
        lastMessageAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error incrementing unread count:", error);
  }
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

export function subscribeToUnreadCount(
  chatId: string,
  userId: string,
  callback: (count: number) => void,
): Unsubscribe {
  if (!chatId || !userId) {
    callback(0);
    return () => {};
  }

  let lastReadAt: Timestamp | null = null;
  let unsubMessages: Unsubscribe | null = null;

  const resubMessages = () => {
    unsubMessages?.();

    if (!lastReadAt) {
      callback(0);
      unsubMessages = null;
      return;
    }

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      where("createdAt", ">", lastReadAt),
      orderBy("createdAt", "asc"),
    );

    unsubMessages = onSnapshot(
      q,
      (snap) => {
        const count = snap.docs.filter(
          (d) => d.data().senderId !== userId && !d.data().isDeleted,
        ).length;
        callback(count);
      },
      () => callback(0),
    );
  };

  const memberRef = doc(db, "chats", chatId, "members", userId);
  const unsubMember = onSnapshot(
    memberRef,
    (snap) => {
      if (!snap.exists()) {
        lastReadAt = null;
        unsubMessages?.();
        unsubMessages = null;
        callback(0);
        return;
      }
      const data = snap.data();
      const newLastReadAt = (data.lastReadAt as Timestamp | null) ?? null;
      const changed = newLastReadAt?.toMillis() !== lastReadAt?.toMillis();
      lastReadAt = newLastReadAt;
      if (changed || unsubMessages === null) {
        resubMessages();
      }
    },
    () => {
      resubMessages();
    },
  );

  return () => {
    unsubMember();
    unsubMessages?.();
  };
}

export function subscribeToChatReadStates(
  chatId: string,
  callback: (lastReadByUser: Map<string, Timestamp>) => void,
): Unsubscribe {
  if (!chatId) {
    callback(new Map());

    return () => {};
  }

  return onSnapshot(
    collection(db, "chats", chatId, "members"),
    (snap) => {
      const result = new Map<string, Timestamp>();
      snap.docs.forEach((d) => {
        const data = d.data();
        const lastReadAt = data.lastReadAt as Timestamp | undefined;

        if (lastReadAt) result.set(d.id, lastReadAt);
      });
      callback(result);
    },
    () => callback(new Map()),
  );
}

export async function editMessage(
  chatId: string,
  messageId: string,
  text: string,
  userId: string,
  attachments?: MessageAttachment[],
): Promise<void> {
  const sanitizedText = sanitizeText(text, {
    allowBasicHtml: false,
    maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
    stripNewlines: false,
    normalizeSpaces: true,
  });

  const hasAttachments = attachments && attachments.length > 0;
  if (!chatId || !messageId || !userId)
    throw new Error("Invalid edit parameters");
  if (!sanitizedText && !hasAttachments)
    throw new Error("Message cannot be empty");

  const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageDoc = await getDoc(messageRef);

    if (!messageDoc.exists()) throw new Error("Message not found");

    const messageData = messageDoc.data();
    if (messageData.senderId !== userId) throw new Error("Unauthorized");
    if (messageData.isDeleted) throw new Error("Cannot edit deleted message");

    const updateData: Record<string, unknown> = {
      text: sanitizedText,
      isEdited: true,
      updatedAt: serverTimestamp(),
    };
    if (attachments !== undefined) {
      updateData.attachments = attachments.length > 0 ? attachments : [];
    }

    await updateDoc(messageRef, updateData);

    const chatDoc = await getDoc(doc(db, "chats", chatId));
    if (chatDoc.exists()) {
      const chatData = chatDoc.data() as Chat;
      if (chatData.lastMessage?.senderId === userId) {
        const lastText = formatLastMessageText(sanitizedText, attachments);
        await updateDoc(doc(db, "chats", chatId), {
          "lastMessage.text": lastText,
          updatedAt: serverTimestamp(),
        });
      }
  }
}

export async function deleteMessageForMe(
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !messageId || !userId)
    throw new Error("Invalid delete parameters");

  const messageRef = doc(db, "chats", chatId, "messages", messageId);

  await Promise.all([
    updateDoc(messageRef, { deletedFor: arrayUnion(userId) }),
    setDoc(
      doc(db, "chats", chatId, "messages", messageId, "deletedFor", userId),
      {
        userId,
        deletedAt: serverTimestamp(),
      },
    ),
  ]);
}

export async function deleteMessageForAll(
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  if (!chatId || !messageId || !userId)
    throw new Error("Invalid delete parameters");

  const messageRef = doc(db, "chats", chatId, "messages", messageId);
  const chatRef = doc(db, "chats", chatId);
  const lastMessageAfterDeletion = await getLastMessageAfterDeletion(
    chatId,
    messageId,
  );

  await runTransaction(db, async (transaction) => {
    const [messageDoc, chatDoc] = await Promise.all([
      transaction.get(messageRef),
      transaction.get(chatRef),
    ]);

    if (!messageDoc.exists()) throw new Error("Message not found");

    const messageData = messageDoc.data();

    if (messageData.senderId !== userId) throw new Error("Unauthorized");
    if (messageData.isDeleted) return;

    const chatData = chatDoc.exists() ? (chatDoc.data() as Chat) : null;
    const participants = chatData?.participants || [];
    const recipientIds = participants.filter((id) => id !== userId);
    const memberRefs = recipientIds.map((recipientId) =>
      doc(db, "chats", chatId, "members", recipientId),
    );
    const memberDocs = await Promise.all(
      memberRefs.map((memberRef) => transaction.get(memberRef)),
    );
    const messageCreatedAt = messageData.createdAt as Timestamp | undefined;

    transaction.update(messageRef, {
      isDeleted: true,
      text: "Сообщение удалено",
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });

    memberDocs.forEach((memberDoc, index) => {
      if (!memberDoc.exists()) return;

      const memberData = memberDoc.data();
      const unreadCount = Math.max(0, Number(memberData.unreadCount) || 0);
      const lastReadAt = memberData.lastReadAt as Timestamp | undefined;
      const wasUnread =
        unreadCount > 0 &&
        (!messageCreatedAt ||
          !lastReadAt ||
          lastReadAt.toMillis() < messageCreatedAt.toMillis());

      if (!wasUnread) return;

      transaction.update(memberRefs[index]!, {
        unreadCount: Math.max(0, unreadCount - 1),
      });
    });

    const lastMessageId = chatData?.lastMessage?.id;
    const isKnownLastMessage =
      lastMessageId === messageId ||
      (!lastMessageId && lastMessageAfterDeletion.isTargetLast);

    if (isKnownLastMessage && chatDoc.exists()) {
      const replacement = lastMessageAfterDeletion.replacement;

      transaction.update(
        chatRef,
        replacement
          ? {
              lastMessage: replacement,
              updatedAt: replacement.createdAt,
            }
          : { lastMessage: null },
      );
    }
  });
}

export async function sendMessagesBatch(
  chatId: string,
  senderId: string,
  messages: {
    text: string;
    forwardedFrom?: string;
    attachments?: MessageAttachment[];
  }[],
): Promise<void> {
  if (!chatId || !senderId || !messages.length)
    throw new Error("Invalid parameters");

  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (!chatDoc.exists()) throw new Error("Chat not found");

  const participants = (chatDoc.data() as Chat).participants || [];

  if (!participants.includes(senderId)) throw new Error("Sender is not a member");

  const otherParticipants = participants.filter((id) => id !== senderId);

  const sanitized = messages
    .map((m) => ({
      text: sanitizeText(m.text, {
        allowBasicHtml: false,
        maxLength: VALIDATION_CONFIG.MESSAGE.MAX_LENGTH,
        stripNewlines: false,
        normalizeSpaces: true,
      }),
      forwardedFrom: m.forwardedFrom,
      attachments: m.attachments,
    }))
    .filter(
      (m) => m.text.length > 0 || (m.attachments && m.attachments.length > 0),
    );

  if (!sanitized.length) throw new Error("No valid messages to send");
  if (sanitized.length + otherParticipants.length + 1 > 500)
    throw new Error("Too many messages or participants");

  const batch = writeBatch(db);
  const messageRefs = sanitized.map((message) => {
    const messageRef = doc(collection(db, "chats", chatId, "messages"));
    const data: Record<string, unknown> = {
      chatId,
      senderId,
      type: "text" as const,
      text: message.text,
      isEdited: false,
      isDeleted: false,
      createdAt: serverTimestamp(),
    };

    if (message.forwardedFrom) data.forwardedFrom = message.forwardedFrom;
    if (message.attachments?.length) data.attachments = message.attachments;

    batch.set(messageRef, data);

    return messageRef;
  });

  const lastRef = messageRefs[messageRefs.length - 1]!;
  const lastSanitized = sanitized[sanitized.length - 1]!;
  const lastText = formatLastMessageText(
    lastSanitized.text,
    lastSanitized.attachments,
  );

  batch.update(chatRef, {
    lastMessage: {
      id: lastRef.id,
      text: lastText,
      senderId,
      createdAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  otherParticipants.forEach((participantId) => {
    batch.set(
      doc(db, "chats", chatId, "members", participantId),
      {
        unreadCount: increment(sanitized.length),
        lastMessageAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  await batch.commit();
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
