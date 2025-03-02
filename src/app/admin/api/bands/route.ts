import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

interface Band {
    id: string;
    name: string;
    score: number;
    averageScore: number;
    rank: number;
}

export async function GET() {
    try {
        const bandsRef = adminDb.collection("bands");

        if (!bandsRef) {
            throw new Error("バンドコレクションの参照が取得できません");
        }

        const snapshot = await bandsRef.get();
        const bands =
            snapshot.docs?.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) || [];

        return NextResponse.json({ bands });
    } catch (error) {
        console.error("詳細なエラー:", error);
        return NextResponse.json(
            {
                error: "バンド情報の取得に失敗しました",
                details:
                    process.env.NODE_ENV === "development"
                        ? error instanceof Error
                            ? error.message
                            : String(error)
                        : undefined,
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const batch = adminDb.batch();

        data.bands.forEach((band: Band) => {
            const docRef = adminDb.collection("bands").doc(band.id);
            batch.set(docRef, band);
        });

        await batch.commit();
        return NextResponse.json({ message: "バンド情報を更新しました" });
    } catch (error) {
        console.error("Error updating bands:", error);
        return NextResponse.json({ error: "バンド情報の更新に失敗しました" }, { status: 500 });
    }
}
