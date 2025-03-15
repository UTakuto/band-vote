import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
    try {
        const votingStatusDoc = await adminDb.collection("settings").doc("votingStatus").get();
        const isVotingOpen = votingStatusDoc.data()?.isOpen ?? true;

        return NextResponse.json({ isVotingOpen });
    } catch (error) {
        console.error("投票状態の取得に失敗:", error);
        return NextResponse.json({ error: "投票状態の取得に失敗しました" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { isVotingOpen } = await request.json();

        await adminDb.collection("settings").doc("votingStatus").set({
            isOpen: isVotingOpen,
        });

        return NextResponse.json({ success: true, isVotingOpen });
    } catch (error) {
        console.error("投票状態の更新に失敗:", error);
        return NextResponse.json({ error: "投票状態の更新に失敗しました" }, { status: 500 });
    }
}
