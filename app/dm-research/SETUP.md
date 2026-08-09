# DM Research Extractor — Setup

A single-user (password-protected) tool at **`/dm-research`** that ingests your
X (Twitter) direct-message history, lets you pull semantically relevant
messages with a natural-language query, exports them as a Markdown file, and
synthesizes themes (with representative quotes) on screen.

## How it works

1. **Corpus** — Your DMs are stored in Vercel KV, sharded into ~500-message
   chunks (`dm:manifest`, `dm:shard:<n>`). Two ways to populate it:
   - **Archive import (primary):** upload `direct-messages.js` (and optionally
     `direct-messages-group.js`) from your X data export. Parsed **in the
     browser**; only normalized records are sent to the server. Free, complete.
   - **Live X API top-up (optional):** OAuth-connect your X account and "Sync
     recent DMs" to merge in newer messages. Requires the X OAuth env vars and
     incurs per-read cost (see below).
2. **Query** — A natural-language query is expanded into keywords (Haiku), the
   corpus is keyword-prefiltered to candidate conversations, then a relevance
   model (Sonnet) judges which are genuinely relevant.
3. **Outputs**
   - **Messages Markdown** (download): every relevant message, attributed to
     `Lucas` / `Them`, grouped by conversation, chronological.
   - **Theme synthesis** (on screen + download): a single Opus pass producing
     themes with verbatim, attributed quotes.

## Required environment variables

| Variable | Purpose |
| --- | --- |
| `DM_RESEARCH_PASSWORD` | The shared password gating the tool. |
| `DM_RESEARCH_SESSION_SECRET` | Random secret used to HMAC-sign session cookies. Generate with `openssl rand -base64 32`. |
| `ANTHROPIC_API_KEY` | Claude API key (already used elsewhere in the app). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV (Upstash) — auto-injected when a KV store is attached. |

## Optional — live X API top-up

Reading DMs needs OAuth 2.0 **user-context** auth (the app-only bearer token
used by the Twitter monitor cannot read DMs). If these are unset, the tool runs
in **archive-only mode** and the X controls are hidden.

| Variable | Value |
| --- | --- |
| `X_OAUTH_CLIENT_ID` | OAuth 2.0 client id from the X developer portal. |
| `X_OAUTH_CLIENT_SECRET` | OAuth 2.0 client secret (use a **confidential** client). |
| `X_OAUTH_REDIRECT_URI` | `https://lucasdickey.com/api/dm-research/oauth/callback` |

In the X developer portal: create an app → enable **OAuth 2.0** → app type
**Web App / Confidential client** → set the callback URL above → request scopes
`dm.read tweet.read users.read offline.access`.

> **Cost note:** As of Feb 2026 X uses pay-per-use pricing with **no free tier**;
> DM reads are billed (~$0.01 each). The sync is capped to a few pages of recent
> messages to keep cost predictable. For full history, prefer the free archive
> import.

## Getting your X archive

X → **Settings → Your account → Download an archive of your data**. X takes up
to ~24h to prepare it. Inside the export, the DM files are
`data/direct-messages.js` and `data/direct-messages-group.js`.
