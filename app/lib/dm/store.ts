// Sharded KV persistence for the DM corpus.
//
// A DM export can be several MB of JSON — too large for a single KV value and
// too large to POST in one request. We therefore split the corpus into shards
// of SHARD_SIZE messages each, plus a manifest describing the set.
//
//   dm:manifest        -> DMManifest
//   dm:shard:<index>   -> DMMessage[]

import { kvGet, kvSet, kvDel } from "@/app/lib/kv";
import type { DMManifest, DMMessage, DMSource } from "./types";

export const SHARD_SIZE = 500;

const MANIFEST_KEY = "dm:manifest";
const shardKey = (i: number) => `dm:shard:${i}`;

export async function getManifest(): Promise<DMManifest | null> {
  return kvGet<DMManifest>(MANIFEST_KEY);
}

export async function getShard(index: number): Promise<DMMessage[]> {
  return (await kvGet<DMMessage[]>(shardKey(index))) ?? [];
}

/** Load and concatenate every shard into the full corpus. */
export async function loadAllMessages(): Promise<DMMessage[]> {
  const manifest = await getManifest();
  if (!manifest) return [];
  const shards = await Promise.all(
    Array.from({ length: manifest.shardCount }, (_, i) => getShard(i))
  );
  return shards.flat();
}

/** Write a single shard during a chunked upload. */
export async function writeShard(
  index: number,
  messages: DMMessage[]
): Promise<void> {
  await kvSet(shardKey(index), messages);
}

/** Delete shards from `from` (inclusive) up to `upTo` (exclusive). */
export async function deleteShards(from: number, upTo: number): Promise<void> {
  for (let i = from; i < upTo; i++) {
    await kvDel(shardKey(i));
  }
}

/** Persist the manifest after shards have been written. */
export async function writeManifest(manifest: DMManifest): Promise<void> {
  await kvSet(MANIFEST_KEY, manifest);
}

/**
 * Replace the entire corpus with `messages`, re-sharding from scratch and
 * cleaning up any shards left over from a previously larger corpus.
 */
export async function replaceCorpus(
  messages: DMMessage[],
  selfId: string | null,
  sources: DMSource[]
): Promise<DMManifest> {
  const prev = await getManifest();
  const shardCount = Math.ceil(messages.length / SHARD_SIZE);

  for (let i = 0; i < shardCount; i++) {
    await writeShard(i, messages.slice(i * SHARD_SIZE, (i + 1) * SHARD_SIZE));
  }
  if (prev && prev.shardCount > shardCount) {
    await deleteShards(shardCount, prev.shardCount);
  }

  const manifest: DMManifest = {
    shardCount,
    totalMessages: messages.length,
    selfId,
    sources,
    updatedAt: new Date().toISOString(),
  };
  await writeManifest(manifest);
  return manifest;
}

/** Wipe the corpus entirely. */
export async function clearCorpus(): Promise<void> {
  const manifest = await getManifest();
  if (manifest) await deleteShards(0, manifest.shardCount);
  await kvDel(MANIFEST_KEY);
}

/**
 * Merge new messages (e.g. from an API top-up) into the stored corpus,
 * de-duplicating by message id, then re-shard. Returns the new manifest.
 */
export async function mergeMessages(incoming: DMMessage[]): Promise<DMManifest> {
  const existing = await loadAllMessages();
  const manifest = await getManifest();

  const byId = new Map<string, DMMessage>();
  for (const m of existing) byId.set(m.id, m);
  for (const m of incoming) byId.set(m.id, m); // incoming wins on conflict

  const merged = Array.from(byId.values()).sort((a, b) =>
    a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
  );

  const sources = Array.from(
    new Set<DMSource>([...(manifest?.sources ?? []), ...incoming.map((m) => m.source)])
  );
  const selfId = manifest?.selfId ?? null;
  return replaceCorpus(merged, selfId, sources);
}
