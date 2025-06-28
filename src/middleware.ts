import { NextResponse } from "next/server";

// Simple middleware - let Clerk handle auth at component level
// This prevents issues with secret keys and keeps auth client-side
export function middleware() {
  // Let all requests through - auth is handled by components
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (for various web standards)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|\\.well-known).*)",
  ],
};
