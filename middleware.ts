import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 認証不要なパブリックルートを定義
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const userAuth = await auth(); // 👈 await を追加

  // ログイン済みでパブリックページに来たら /home にリダイレクト
  if (userAuth.userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 未ログインで保護されたページに来たら /sign-in にリダイレクト
  if (!userAuth.userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};