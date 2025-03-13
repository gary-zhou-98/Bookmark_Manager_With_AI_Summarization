import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "@/config/env";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/home/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/home")) {
    return await authMiddleware(request);
  }

  return NextResponse.next();
}

async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("access_token_cookie")?.value;
  if (!token || !envConfig.jwtSecret) {
    NextResponse.redirect(new URL("/auth/login", request.url));
  }
  try {
    const { payload } = await jwtVerify(
      new TextEncoder().encode(token),
      new TextEncoder().encode(envConfig.jwtSecret)
    );
    const userId = payload.sub;

    if (!userId) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const pathUserId = request.nextUrl.pathname.split("/")[2];
    if (userId !== pathUserId) {
      return NextResponse.redirect(new URL(`/home/${userId}`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
