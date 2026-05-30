// Self-contained, edge-safe session auth for the DM Research tool.
//
// No third-party auth service: a single shared password (DM_RESEARCH_PASSWORD)
// gates the tool. On success we issue a stateless, HMAC-signed session token
// (signed with DM_RESEARCH_SESSION_SECRET) stored in an httpOnly cookie. Both
// the Edge middleware and Node route handlers can verify it because everything
// here uses the Web Crypto API available in both runtimes.

export const SESSION_COOKIE = "dmr_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bytesToBase64Url(new Uint8Array(sig));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Create a signed `<expiry>.<sig>` session token. */
export async function createSessionToken(secret: string): Promise<string> {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = await hmac(secret, exp);
  return `${exp}.${sig}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Date.now() > Number(exp)) return false;
  const expected = await hmac(secret, exp);
  return safeEqual(sig, expected);
}

/** The secret used to sign sessions, with a clear error if unconfigured. */
export function getSessionSecret(): string {
  const secret = process.env.DM_RESEARCH_SESSION_SECRET;
  if (!secret) {
    throw new Error("DM_RESEARCH_SESSION_SECRET environment variable is not set");
  }
  return secret;
}
