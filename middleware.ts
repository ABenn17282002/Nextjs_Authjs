import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  const isLoggedIn = !!token;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/user", "/product"];

  // 未ログインユーザーが保護ページに来たらリダイレクト
  if (!isLoggedIn && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ログイン済みユーザーが /login に来たらダッシュボードへ
  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 例：admin以外は /admin に入れないようにしたいとき
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)", // `/api/auth` ルートを除外
    ],
};