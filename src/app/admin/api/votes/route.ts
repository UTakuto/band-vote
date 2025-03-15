import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
    try {
        const votesSnapshot = await adminDb.collection("votes").get();
        const votes = votesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("取得した投票データ:", votes); // デバッグ用

        return NextResponse.json({ votes });
    } catch (error) {
        console.error("投票データの取得に失敗:", error);
        return NextResponse.json({ error: "投票データの取得に失敗しました" }, { status: 500 });
    }
}
