import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // デバッグ用のログ追加
    console.log("Middleware path:", path);
    console.log("All cookies:", request.cookies.getAll());
    console.log("Auth cookie:", request.cookies.get("admin_auth"));

    if (path.startsWith("/admin/api")) {
        return NextResponse.next();
    }

    const authCookie = request.cookies.get("admin_auth");
    const isAuthenticated = authCookie?.value === "true";

    console.log("Is authenticated:", isAuthenticated); // デバッグ用

    if (path.startsWith("/admin/results") && !isAuthenticated) {
        console.log("Redirecting to /admin due to authentication failure");
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
