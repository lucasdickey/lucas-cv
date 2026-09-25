import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/dm/auth";

// Gate the DM Research data APIs behind the shared-password session cookie.
// The login/session-check endpoints stay public (they establish/inspect the
// session); the page itself is harmless and renders its own password prompt.
const PUBLIC_PATHS = ["/api/dm-research/auth", "/api/dm-research/session"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.DM_RESEARCH_SESSION_SECRET;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!secret || !(await verifySessionToken(token, secret))) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to the DM Research tool." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/dm-research/:path*"],
};
