import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "./constants";

// アプリケーションの初期化（シングルトンパターン）
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];

// Firebaseサービスのエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app }; // アプリケーションインスタンスのエクスポート
