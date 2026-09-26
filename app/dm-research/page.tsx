"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  assignFromMe,
  detectSelfId,
  parseArchiveFile,
} from "@/app/lib/dm/parse";
import type { DMMessage } from "@/app/lib/dm/types";

// Keep in sync with SHARD_SIZE in app/lib/dm/store.ts. Defined locally so this
// client bundle doesn't import the server-only KV module.
const SHARD_SIZE = 500;

interface SessionState {
  authenticated: boolean;
  configured?: boolean;
  corpus?: { totalMessages: number; sources: string[]; updatedAt: string } | null;
  xApiConfigured?: boolean;
  xConnected?: boolean;
}

interface QueryResult {
  query: string;
  keywords: string[];
  stats: {
    corpusMessages: number;
    candidates: number;
    relevant: number;
    messages: number;
  };
  conversationIds: string[];
  markdown: string;
}

// ── tiny markdown renderer (headings / bold / lists / quotes) ──
function renderMarkdown(md: string): React.ReactNode {
  const lines = md.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  const flushList = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-6 my-2 space-y-1">
          {list.map((li, i) => (
            <li key={i}>{inline(li)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushList();
      out.push(<h3 key={out.length} className="text-lg font-semibold text-[#172B4D] mt-5 mb-1">{inline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(<h2 key={out.length} className="text-xl font-bold text-[#172B4D] mt-6 mb-2">{inline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      flushList();
      out.push(<h1 key={out.length} className="text-2xl font-bold text-[#172B4D] mt-2 mb-3">{inline(line.slice(2))}</h1>);
    } else if (line.startsWith("> ")) {
      flushList();
      out.push(<blockquote key={out.length} className="border-l-4 border-[#0052CC] pl-3 italic text-[#42526E] my-2">{inline(line.slice(2))}</blockquote>);
    } else if (/^[-*] /.test(line)) {
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      out.push(<p key={out.length} className="my-2 leading-relaxed text-[#172B4D]">{inline(line)}</p>);
    }
  }
  flushList();
  return out;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const btn =
  "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const btnPrimary = `${btn} bg-[#0052CC] text-white hover:bg-[#0065FF]`;
const btnSecondary = `${btn} border border-[#dfe1e6] text-[#172B4D] hover:bg-[#f4f5f7]`;

export default function DmResearchPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const [query, setQuery] = useState("");
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [synthesis, setSynthesis] = useState<string>("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refreshSession = useCallback(async () => {
    const res = await fetch("/api/dm-research/session");
    setSession(await res.json());
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Surface the OAuth callback outcome from the redirect query string.
  useEffect(() => {
    const x = new URLSearchParams(window.location.search).get("x");
    if (x) {
      setUploadStatus(
        x === "connected" ? "X account connected." : `X connection: ${x}.`
      );
      window.history.replaceState({}, "", "/dm-research");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/dm-research/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await refreshSession();
    } else {
      const data = await res.json().catch(() => ({}));
      setLoginError(data.error ?? "Login failed.");
    }
  }

  async function handleLogout() {
    await fetch("/api/dm-research/auth", { method: "DELETE" });
    await refreshSession();
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadStatus("Parsing archive…");
    setError("");
    try {
      let all: DMMessage[] = [];
      for (const file of Array.from(files)) {
        const text = await file.text();
        all = all.concat(parseArchiveFile(text));
      }
      // De-dupe by id across files.
      const byId = new Map<string, DMMessage>();
      for (const m of all) byId.set(m.id, m);
      let messages = Array.from(byId.values());

      const selfId = detectSelfId(messages);
      if (selfId) messages = assignFromMe(messages, selfId);
      messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

      const shardCount = Math.ceil(messages.length / SHARD_SIZE);
      setUploadStatus(`Parsed ${messages.length} messages. Uploading…`);

      await fetch("/api/dm-research/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "begin" }),
      });

      for (let i = 0; i < shardCount; i++) {
        const shard = messages.slice(i * SHARD_SIZE, (i + 1) * SHARD_SIZE);
        const res = await fetch("/api/dm-research/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "shard", index: i, messages: shard }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
        setUploadStatus(`Uploading shard ${i + 1}/${shardCount}…`);
      }

      await fetch("/api/dm-research/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "commit",
          shardCount,
          totalMessages: messages.length,
          selfId,
          sources: ["archive"],
        }),
      });

      setUploadStatus(`Stored ${messages.length} messages.`);
      await refreshSession();
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
      setUploadStatus("");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function syncX() {
    setUploadStatus("Syncing recent DMs from X…");
    setError("");
    try {
      const res = await fetch("/api/dm-research/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed");
      setUploadStatus(`Synced. Added ${data.added} new messages (${data.totalMessages} total).`);
      await refreshSession();
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    }
  }

  async function runResearch() {
    if (!query.trim()) return;
    setRunning(true);
    setError("");
    setResult(null);
    setSynthesis("");
    try {
      setPhase("Retrieving relevant conversations…");
      const qres = await fetch("/api/dm-research/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const qdata = await qres.json();
      if (!qres.ok) throw new Error(qdata.error ?? "Query failed");
      setResult(qdata);

      if (qdata.conversationIds.length > 0) {
        setPhase("Synthesizing themes…");
        const sres = await fetch("/api/dm-research/synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, conversationIds: qdata.conversationIds }),
        });
        const sdata = await sres.json();
        if (!sres.ok) throw new Error(sdata.error ?? "Synthesis failed");
        setSynthesis(sdata.markdown);
      }
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setRunning(false);
      setPhase("");
    }
  }

  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "research";

  // ── Loading ──
  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] text-[#6B778C]">
        Loading…
      </div>
    );
  }

  // ── Login gate ──
  if (!session.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-[#e1e4e8] rounded-lg p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#172B4D] mb-1">DM Research</h1>
          <p className="text-sm text-[#6B778C] mb-4">Enter the password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-[#dfe1e6] rounded-md px-3 py-2 mb-3 text-[#172B4D] focus:outline-none focus:border-[#0052CC]"
            autoFocus
          />
          {loginError && <p className="text-sm text-red-600 mb-3">{loginError}</p>}
          {session.configured === false && (
            <p className="text-xs text-amber-700 mb-3">
              Server not fully configured: set DM_RESEARCH_PASSWORD and DM_RESEARCH_SESSION_SECRET.
            </p>
          )}
          <button type="submit" className={`${btnPrimary} w-full`}>Sign in</button>
        </form>
      </div>
    );
  }

  // ── Main app ──
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#172B4D]">DM Research Extractor</h1>
            <p className="text-[#6B778C] mt-1">
              Pull semantically relevant X DMs for research, export them as Markdown, and synthesize themes.
            </p>
          </div>
          <button onClick={handleLogout} className={btnSecondary}>Sign out</button>
        </div>

        {/* Corpus + sources */}
        <section className="bg-white border border-[#e1e4e8] rounded-lg p-5 mb-5">
          <h2 className="font-semibold text-[#172B4D] mb-3">1 · DM corpus</h2>
          {session.corpus ? (
            <p className="text-sm text-[#42526E] mb-3">
              <strong>{session.corpus.totalMessages.toLocaleString()}</strong> messages stored
              {" · "}sources: {session.corpus.sources.join(", ")}
              {" · "}updated {new Date(session.corpus.updatedAt).toLocaleString()}
            </p>
          ) : (
            <p className="text-sm text-[#6B778C] mb-3">No corpus yet. Upload your X archive DM files below.</p>
          )}

          <label className={`${btnSecondary} cursor-pointer`}>
            {uploading ? "Working…" : "Upload archive (direct-messages.js)"}
            <input
              ref={fileRef}
              type="file"
              accept=".js,.json"
              multiple
              hidden
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
          <p className="text-xs text-[#6B778C] mt-2">
            From X: Settings → Your account → Download an archive of your data. Upload
            <code className="mx-1">direct-messages.js</code> (and
            <code className="mx-1">direct-messages-group.js</code> if you want group DMs). Parsed in your
            browser; only normalized message records are stored.
          </p>

          {/* Optional live X top-up */}
          {session.xApiConfigured && (
            <div className="mt-4 pt-4 border-t border-[#f0f1f3]">
              <p className="text-sm text-[#42526E] mb-2">
                Live X API top-up {session.xConnected ? "· connected" : "· not connected"}
              </p>
              <div className="flex gap-2 flex-wrap">
                <a href="/api/dm-research/oauth/start" className={btnSecondary}>
                  {session.xConnected ? "Reconnect X" : "Connect X account"}
                </a>
                <button onClick={syncX} disabled={!session.xConnected} className={btnSecondary}>
                  Sync recent DMs
                </button>
              </div>
              <p className="text-xs text-[#6B778C] mt-2">
                Note: X charges per DM read under 2026 pay-per-use pricing. Syncing fetches a
                capped window of recent messages and merges them into your corpus.
              </p>
            </div>
          )}

          {uploadStatus && <p className="text-sm text-[#0052CC] mt-3">{uploadStatus}</p>}
        </section>

        {/* Query */}
        <section className="bg-white border border-[#e1e4e8] rounded-lg p-5 mb-5">
          <h2 className="font-semibold text-[#172B4D] mb-3">2 · Research query</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What pain points did people share about onboarding and first-run setup?"
            rows={3}
            className="w-full border border-[#dfe1e6] rounded-md px-3 py-2 text-[#172B4D] focus:outline-none focus:border-[#0052CC]"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={runResearch}
              disabled={running || !query.trim() || !session.corpus}
              className={btnPrimary}
            >
              {running ? "Running…" : "Extract & synthesize"}
            </button>
            {running && <span className="text-sm text-[#6B778C]">{phase}</span>}
            {!session.corpus && (
              <span className="text-sm text-[#6B778C]">Upload a corpus first.</span>
            )}
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-5 text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <section className="bg-white border border-[#e1e4e8] rounded-lg p-5 mb-5">
            <h2 className="font-semibold text-[#172B4D] mb-3">3 · Extracted messages</h2>
            <p className="text-sm text-[#42526E] mb-3">
              Scanned {result.stats.corpusMessages.toLocaleString()} messages →
              {" "}{result.stats.candidates} candidate conversations →
              {" "}<strong>{result.stats.relevant}</strong> relevant ({result.stats.messages} messages).
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {result.keywords.slice(0, 16).map((k) => (
                <span key={k} className="text-xs bg-[#f4f5f7] text-[#42526E] rounded px-2 py-0.5">{k}</span>
              ))}
            </div>
            <button
              onClick={() => download(`dm-extract-${slug(result.query)}.md`, result.markdown)}
              disabled={result.conversationIds.length === 0}
              className={btnSecondary}
            >
              ⬇ Download messages markdown
            </button>
          </section>
        )}

        {/* Synthesis (on screen + download) */}
        {synthesis && (
          <section className="bg-white border border-[#e1e4e8] rounded-lg p-6 mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#172B4D]">4 · Theme synthesis</h2>
              <button
                onClick={() => download(`dm-synthesis-${slug(result?.query ?? "research")}.md`, synthesis)}
                className={btnSecondary}
              >
                ⬇ Download synthesis
              </button>
            </div>
            <div className="prose-sm max-w-none">{renderMarkdown(synthesis)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
