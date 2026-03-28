import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("veris_auth_token")?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!token && !isLoginPage) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isLoginPage) {
    // Redirect authenticated users away from login
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|logo-veris\\.png|favicon\\.png).*)"],
};
