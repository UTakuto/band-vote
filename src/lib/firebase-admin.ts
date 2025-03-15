import * as admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Firebase Admin の初期化（シングルトンパターン）
const app = !getApps().length
    ? initializeApp({
          credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
      })
    : getApps()[0];

// Admin SDKのサービスをエクスポート
export const auth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
