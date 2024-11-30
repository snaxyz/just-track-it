import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./server/auth0";

const publicPaths = ["/login", "/api/auth/google/redirect"];

export default async function middleware(request: NextRequest) {
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next(request);
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
