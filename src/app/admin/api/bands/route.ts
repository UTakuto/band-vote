import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Band } from "@/types/types";

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
        
        // 単一バンドの追加の場合
        if (data.name) {
            const newBand = {
                name: data.name,
                score: 0,
                averageScore: 0,
                rank: 0,
                order: data.order || 0,
                createdAt: new Date().toISOString(),
            };

            const docRef = adminDb.collection("bands").doc();
            await docRef.set(newBand);
            
            console.log("新しいバンドを追加しました:", { id: docRef.id, ...newBand });
            
            return NextResponse.json({ 
                message: "バンドを追加しました",
                band: { id: docRef.id, ...newBand }
            });
        }
        
        // 複数バンドのバッチ更新の場合
        if (data.bands && Array.isArray(data.bands)) {
            const batch = adminDb.batch();

            data.bands.forEach((band: Band) => {
                const docRef = adminDb.collection("bands").doc(band.id);
                batch.set(docRef, band);
            });

            await batch.commit();
            return NextResponse.json({ message: "バンド情報を更新しました" });
        }

        return NextResponse.json({ error: "無効なリクエストデータです" }, { status: 400 });
    } catch (error) {
        console.error("Error processing bands:", error);
        return NextResponse.json({ error: "バンド処理に失敗しました" }, { status: 500 });
    }
}
