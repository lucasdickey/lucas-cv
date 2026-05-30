import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/dm/auth";
import { getManifest } from "@/app/lib/dm/store";
import { isXApiConfigured, isXConnected } from "@/app/lib/dm/xapi";

export const runtime = "nodejs";

/**
 * GET — public session/status probe. Reports whether the caller is signed in
 * and, if so, a summary of the stored corpus and X-connection state so the UI
 * can render the right controls.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.DM_RESEARCH_SESSION_SECRET;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = Boolean(secret) && (await verifySessionToken(token, secret!));

  if (!authenticated) {
    return NextResponse.json({
      authenticated: false,
      configured: Boolean(process.env.DM_RESEARCH_PASSWORD && secret),
    });
  }

  let manifest = null;
  try {
    manifest = await getManifest();
  } catch {
    /* KV may be unconfigured; treat as empty corpus */
  }

  let xConnected = false;
  try {
    xConnected = await isXConnected();
  } catch {
    /* ignore */
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    corpus: manifest
      ? {
          totalMessages: manifest.totalMessages,
          sources: manifest.sources,
          updatedAt: manifest.updatedAt,
        }
      : null,
    xApiConfigured: isXApiConfigured(),
    xConnected,
  });
}
