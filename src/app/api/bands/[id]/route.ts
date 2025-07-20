import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: bandId } = await params;
        console.log("取得リクエストを受信:", bandId);

        // バンドの存在確認
        const bandRef = doc(db, "bands", bandId);
        const bandDoc = await getDoc(bandRef);

        if (!bandDoc.exists()) {
            console.log("バンドが存在しません:", bandId);
            return NextResponse.json({ error: "指定されたバンドが存在しません" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: { id: bandDoc.id, ...bandDoc.data() },
        });
    } catch (error) {
        console.error("取得処理でエラー:", error);
        return NextResponse.json(
            {
                error: "バンドの取得に失敗しました",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bandId } = await params;
        console.log("削除リクエストを受信:", bandId);

        // バンドの存在確認
        const bandRef = doc(db, "bands", bandId);
        const bandDoc = await getDoc(bandRef);

        if (!bandDoc.exists()) {
            console.log("バンドが存在しません:", bandId);
            return NextResponse.json({ error: "指定されたバンドが存在しません" }, { status: 404 });
        }

        // バンドを削除
        await deleteDoc(bandRef);
        console.log("バンドを削除しました:", bandId);

        return NextResponse.json({
            success: true,
            message: "バンドを削除しました",
        });
    } catch (error) {
        console.error("削除処理でエラー:", error);
        return NextResponse.json(
            {
                error: "バンドの削除に失敗しました",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
