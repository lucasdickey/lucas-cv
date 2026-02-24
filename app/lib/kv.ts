/**
 * Lightweight Vercel KV (Upstash Redis REST API) client.
 *
 * Uses the same env vars that Vercel auto-injects when you add a KV store:
 *   - KV_REST_API_URL
 *   - KV_REST_API_TOKEN
 *
 * No npm dependency required — just raw fetch.
 */

function getConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "KV_REST_API_URL and KV_REST_API_TOKEN environment variables must be set. " +
        "Add a Vercel KV store to your project to get these automatically."
    );
  }
  return { url, token };
}

async function kvCommand<T>(command: string[]): Promise<T> {
  const { url, token } = getConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`KV error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.result as T;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const raw = await kvCommand<string | null>(["GET", key]);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  await kvCommand(["SET", key, serialized]);
}
