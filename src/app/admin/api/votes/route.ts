import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
    try {
        const votesRef = adminDb.collection("votes");

        if (!votesRef) {
            throw new Error("投票コレクションの参照が取得できません");
        }

        const snapshot = await votesRef.orderBy("createdAt", "desc").limit(100).get();

        const votes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ votes });
    } catch (error) {
        console.error("詳細なエラー:", error);
        return NextResponse.json({ error: "投票履歴の取得に失敗しました" }, { status: 500 });
    }
}
