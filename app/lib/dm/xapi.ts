// Optional live top-up via the X (Twitter) API v2 DM endpoints.
//
// Reading DMs requires OAuth 2.0 *user-context* auth with the `dm.read` scope
// (the app-only bearer token used elsewhere in this repo cannot read DMs), and
// under X's 2026 pay-per-use pricing each DM read is billed. This module is
// only active when the X OAuth env vars are configured; otherwise the tool runs
// in archive-only mode.

import { kvGet, kvSet, kvDel } from "@/app/lib/kv";
import type { DMMessage } from "./types";

const AUTHORIZE_URL = "https://twitter.com/i/oauth2/authorize";
const TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const SCOPES = ["dm.read", "tweet.read", "users.read", "offline.access"];

const TOKEN_KEY = "dm:x_oauth"; // { refreshToken, accessToken, expiresAt }

interface StoredTokens {
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
}

export function isXApiConfigured(): boolean {
  return Boolean(
    process.env.X_OAUTH_CLIENT_ID &&
      process.env.X_OAUTH_CLIENT_SECRET &&
      process.env.X_OAUTH_REDIRECT_URI
  );
}

function clientConfig() {
  const clientId = process.env.X_OAUTH_CLIENT_ID;
  const clientSecret = process.env.X_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.X_OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("X OAuth env vars (X_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI) are not set");
  }
  return { clientId, clientSecret, redirectUri };
}

function basicAuthHeader(): string {
  const { clientId, clientSecret } = clientConfig();
  return "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

// ── PKCE helpers ──

function base64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function randomToken(byteLength = 32): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/** Build the X authorization URL for a PKCE flow. */
export async function buildAuthorizeUrl(
  state: string,
  verifier: string
): Promise<string> {
  const { clientId, redirectUri } = clientConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    state,
    code_challenge: await codeChallenge(verifier),
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE_URL}?${params}`;
}

// ── Token exchange / refresh ──

async function postToken(body: URLSearchParams): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`X token error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/** Exchange an authorization code for tokens and persist them. */
export async function exchangeCode(code: string, verifier: string): Promise<void> {
  const { clientId, redirectUri } = clientConfig();
  const data = await postToken(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    })
  );
  await kvSet(TOKEN_KEY, {
    refreshToken: data.refresh_token ?? "",
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  } satisfies StoredTokens);
}

export async function isXConnected(): Promise<boolean> {
  const tokens = await kvGet<StoredTokens>(TOKEN_KEY);
  return Boolean(tokens?.refreshToken);
}

export async function disconnectX(): Promise<void> {
  await kvDel(TOKEN_KEY);
}

/** Return a valid access token, refreshing if needed. */
async function getAccessToken(): Promise<string> {
  const tokens = await kvGet<StoredTokens>(TOKEN_KEY);
  if (!tokens?.refreshToken) {
    throw new Error("X account is not connected. Authorize access first.");
  }
  if (tokens.accessToken && Date.now() < tokens.expiresAt - 60_000) {
    return tokens.accessToken;
  }
  const { clientId } = clientConfig();
  const data = await postToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refreshToken,
      client_id: clientId,
    })
  );
  await kvSet(TOKEN_KEY, {
    refreshToken: data.refresh_token ?? tokens.refreshToken,
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  } satisfies StoredTokens);
  return data.access_token;
}

// ── DM fetch ──

interface DmEvent {
  id: string;
  event_type: string;
  text?: string;
  sender_id?: string;
  dm_conversation_id?: string;
  created_at?: string;
}

/** The owner's X user id (used to set fromMe on API-sourced messages). */
export async function fetchOwnerId(): Promise<string | null> {
  const token = await getAccessToken();
  const res = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { data?: { id?: string } };
  return data.data?.id ?? null;
}

/**
 * Fetch recent DM events, paginating up to `maxPages` (×100). Each read is
 * billed under pay-per-use, so the cap is intentionally conservative.
 */
export async function fetchRecentDmMessages(
  selfId: string | null,
  maxPages = 5
): Promise<DMMessage[]> {
  const token = await getAccessToken();
  const owner = selfId ?? (await fetchOwnerId());
  const messages: DMMessage[] = [];
  let paginationToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      max_results: "100",
      "dm_event.fields": "id,text,event_type,created_at,sender_id,dm_conversation_id",
    });
    if (paginationToken) params.set("pagination_token", paginationToken);

    const res = await fetch(`https://api.twitter.com/2/dm_events?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`X dm_events error ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as {
      data?: DmEvent[];
      meta?: { next_token?: string };
    };

    for (const ev of data.data ?? []) {
      if (ev.event_type !== "MessageCreate" || !ev.dm_conversation_id || !ev.sender_id) {
        continue;
      }
      messages.push({
        id: ev.id,
        conversationId: ev.dm_conversation_id,
        senderId: ev.sender_id,
        text: ev.text ?? "",
        createdAt: ev.created_at ?? new Date().toISOString(),
        fromMe: owner ? ev.sender_id === owner : false,
        source: "api",
      });
    }

    paginationToken = data.meta?.next_token;
    if (!paginationToken) break;
  }

  return messages;
}
