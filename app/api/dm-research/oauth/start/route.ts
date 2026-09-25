import { NextResponse } from "next/server";
import {
  buildAuthorizeUrl,
  isXApiConfigured,
  randomToken,
} from "@/app/lib/dm/xapi";

export const runtime = "nodejs";

/**
 * GET — begin the X OAuth 2.0 PKCE flow. Navigated to as a top-level request
 * (so the session cookie is sent). Stores `state` + PKCE `code_verifier` in
 * short-lived httpOnly cookies and redirects to X's authorize screen.
 */
export async function GET() {
  if (!isXApiConfigured()) {
    return NextResponse.json(
      { error: "X API is not configured. Set X_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI." },
      { status: 400 }
    );
  }

  const state = randomToken(16);
  const verifier = randomToken(32);
  const url = await buildAuthorizeUrl(state, verifier);

  const res = NextResponse.redirect(url);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/dm-research/oauth",
    maxAge: 600, // 10 minutes to complete the flow
  };
  res.cookies.set("dmr_oauth_state", state, cookieOpts);
  res.cookies.set("dmr_oauth_verifier", verifier, cookieOpts);
  return res;
}
