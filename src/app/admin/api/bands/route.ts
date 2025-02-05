import { db } from "../calculate/route";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const bandsRef = collection(db, "bands");
        const snapshot = await getDocs(bandsRef);
        const bands = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json({ bands });
    } catch (error) {
        return NextResponse.json(
            { error: "バンド情報の取得に失敗しました" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const bandsRef = collection(db, "bands");

        for (const band of data.bands) {
            await setDoc(doc(bandsRef, band.id), band);
        }

        return NextResponse.json({ message: "バンド情報を更新しました" });
    } catch (error) {
        return NextResponse.json(
            { error: "バンド情報の更新に失敗しました" },
            { status: 500 }
        );
    }
}
