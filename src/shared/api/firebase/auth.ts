import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./index";

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateDoc(doc(db, "users", user.uid), {
      isOnline: true,
      lastSeen: serverTimestamp(),
    });

    return user;
  } catch (error) {
    console.error("Ошибка входа:", error);

    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const nameParts = user.displayName?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        firstName,
        lastName,
        photoURL: user.photoURL || null,
        isOnline: true,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
    } else {
      await updateDoc(userDocRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.error("Ошибка Google входа:", error);

    throw error;
  }
}

export async function logout() {
  try {
    const user = auth.currentUser;

    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    }

    await signOut(auth);
  } catch (error) {
    console.error("Ошибка выхода:", error);

    throw error;
  }
}
