import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const doc = await adminDb.collection("config").doc("votingStatus").get();
        const data = doc.data();
        return NextResponse.json({ isVotingOpen: data?.isOpen ?? true });
    } catch (error) {
        console.error("投票状態の取得に失敗しました:", error);
        return NextResponse.json({ error: "投票状態の取得に失敗しました" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { isVotingOpen } = await request.json();
        await adminDb.collection("config").doc("votingStatus").set({
            isOpen: isVotingOpen,
            updatedAt: new Date().toISOString(),
        });
        return NextResponse.json({ message: "投票状態を更新しました" });
    } catch (error) {
        console.error("投票状態の更新に失敗しました:", error);
        return NextResponse.json({ error: "投票状態の更新に失敗しました" }, { status: 500 });
    }
}
