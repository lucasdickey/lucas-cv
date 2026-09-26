import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  getSessionSecret,
  safeEqual,
} from "@/app/lib/dm/auth";

export const runtime = "nodejs";

/** POST { password } — verify the shared password and issue a session cookie. */
export async function POST(request: NextRequest) {
  const expected = process.env.DM_RESEARCH_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "DM_RESEARCH_PASSWORD is not configured on the server." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    ({ password = "" } = await request.json());
  } catch {
    /* ignore malformed body */
  }

  if (!password || !safeEqual(password, expected)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(getSessionSecret());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}

/** DELETE — log out by clearing the session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
