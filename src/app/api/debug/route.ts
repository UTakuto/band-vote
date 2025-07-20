import { NextResponse } from "next/server";

export async function GET() {
    try {
        const envCheck = {
            NODE_ENV: process.env.NODE_ENV,
            hasFirebaseApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            hasFirebaseAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            hasFirebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            hasFirebaseStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            hasFirebaseMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            hasFirebaseAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            hasAdminProjectId: !!process.env.FIREBASE_PROJECT_ID,
            hasAdminClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
            hasAdminPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(envCheck);
    } catch (error) {
        return NextResponse.json(
            { error: "Debug endpoint failed", details: String(error) },
            { status: 500 }
        );
    }
}
