import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // バンドのコレクションを削除
        const bandsSnapshot = await adminDb.collection("bands").get();
        const bandDeletions = bandsSnapshot.docs.map((doc) => doc.ref.delete());

        // 投票のコレクションを削除
        const votesSnapshot = await adminDb.collection("votes").get();
        const voteDeletions = votesSnapshot.docs.map((doc) => doc.ref.delete());

        // 全ての削除処理を待機
        await Promise.all([...bandDeletions, ...voteDeletions]);

        return NextResponse.json({ message: "データを正常にリセットしました" });
    } catch (error) {
        console.error("リセット中にエラーが発生しました:", error);
        return NextResponse.json({ error: "データのリセットに失敗しました" }, { status: 500 });
    }
}
