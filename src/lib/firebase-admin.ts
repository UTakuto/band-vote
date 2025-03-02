import * as admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log("Firebase Admin initialized successfully");
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        throw new Error("Firebase Admin initialization failed");
    }
}

export const adminDb = admin.firestore();
