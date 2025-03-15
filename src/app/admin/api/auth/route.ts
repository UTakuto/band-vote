import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2025";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            // レスポンスを作成する前にクッキーを設定
            const response = NextResponse.json({
                success: true,
                message: "認証成功",
            });

            // クッキーの設定
            response.cookies.set("admin_auth", "true", {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24,
            });

            console.log("Cookie set:", response.cookies.get("admin_auth")); // デバッグ用

            return response;
        }

        return NextResponse.json(
            { success: false, message: "パスワードが一致しません" },
            { status: 401 }
        );
    } catch (error) {
        console.error("❌ 認証エラー:", error);
        return NextResponse.json(
            { success: false, message: "認証エラーが発生しました" },
            { status: 500 }
        );
    }
}
