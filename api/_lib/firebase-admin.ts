import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function getApp(): App {
  if (app) return app;

  if (getApps().length > 0) {
    app = getApps()[0];

    return app;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set");
  }

  const serviceAccount = JSON.parse(raw);

  if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n",
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount),
  });

  return app;
}

export function adminAuth(): Auth {
  return getAuth(getApp());
}

export function adminDb(): Firestore {
  return getFirestore(getApp());
}
