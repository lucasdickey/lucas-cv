import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/app/lib/dm/xapi";

export const runtime = "nodejs";

/**
 * GET — X redirects here with ?code & ?state. We verify state against the
 * cookie, exchange the code for tokens (persisted in KV), then bounce back to
 * the tool UI.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const back = (status: string) =>
    NextResponse.redirect(`${origin}/dm-research?x=${status}`);

  if (error) return back("denied");

  const cookieState = request.cookies.get("dmr_oauth_state")?.value;
  const verifier = request.cookies.get("dmr_oauth_verifier")?.value;

  if (!code || !state || !cookieState || state !== cookieState || !verifier) {
    return back("invalid");
  }

  try {
    await exchangeCode(code, verifier);
  } catch {
    return back("error");
  }

  const res = back("connected");
  // Clear the one-time flow cookies.
  res.cookies.set("dmr_oauth_state", "", { path: "/api/dm-research/oauth", maxAge: 0 });
  res.cookies.set("dmr_oauth_verifier", "", { path: "/api/dm-research/oauth", maxAge: 0 });
  return res;
}
