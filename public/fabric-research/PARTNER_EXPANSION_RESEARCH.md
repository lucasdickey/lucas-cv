# SaaS Provisioning CLI: Partner Expansion Research

**Date:** 2026-01-31
**Objective:** Identify 50 high-conviction supply-side partners to expand beyond the 7 launch partners (Sentry, Clerk, Supabase, Neon, Vercel, PostHog, Resend) across key infrastructure primitives.

**Target Customer:** Solo founders, serial small business creators, small dev teams, and dev shops consuming the CLI via agentic tools (Claude Code, Droid, Warp Agent, Jules CLI, Gemini CLI) and AI-native IDEs (Cursor, Windsurf, Antigravity).

---

## Methodology

This research synthesizes data from 6 parallel research tracks:

1. **Corporate card spend data** — Brex Benchmark (35K+ customers) and Ramp (40K-50K+ businesses) monthly vendor reports through December 2025
2. **Developer tool popularity** — GitHub stars, npm weekly downloads, Stack Overflow 2025 Survey (49K respondents), GitHub Octoverse 2025
3. **Community sentiment** — Reddit (r/webdev, r/SaaS, r/programming), dev influencer recommendations (Theo/t3gg, Fireship, Primeagen), Product Hunt
4. **Growth velocity** — Published ARR, funding rounds, YoY growth rates, Brex fastest-growing vendors list
5. **Marketplace validation** — Vercel Marketplace, Netlify Integrations, startup credit programs (OpenVC, Secret, Brex Day Zero Stack)
6. **Tech stack analysis** — StackShare adoption, BuiltWith trends, State of JS 2024, indie hacker stack surveys

---

## Initial List: 50 Partners by Primitive Type

### 1. TRANSACTIONAL EMAIL & COMMUNICATIONS

> Resend is a launch partner. These expand the messaging primitive.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 1 | **Twilio** | SMS/Voice/Email API | #2 overall SaaS vendor by startup spend on Brex Benchmark mid-2025. Global SMS/voice leader used as downstream by Novu, Knock, Courier. | Yes (REST API, CLI, SDKs) | Public company; dominant market position |
| 2 | **Novu** | Notification orchestration | 38K+ GitHub stars (MIT). Unified notifications: email, SMS, push, in-app, chat. 10K free events/mo. Open source fits indie developer ethos. | Yes (REST API, SDK, self-host) | 38K GitHub stars; OSS |
| 3 | **Knock** | Notification orchestration | Enterprise-grade workflow orchestration with batching/digests. Recommended in developer communities for production notification routing. | Yes (REST API, SDK) | Closed-source SaaS; $250/mo starter |
| 4 | **SendGrid** (Twilio) | Transactional email | Industry standard transactional email. 100 free emails/day. Massive install base. | Yes (REST API, CLI, SDK) | Legacy dominance; high npm downloads |
| 5 | **Postmark** | Transactional email | Best deliverability reputation among devs. Trusted by 1Password, Paddle. Strong on Reddit/indie hacker communities. | Yes (REST API, SDK) | Premium deliverability positioning |

**Primary Sources:**
- [Brex Benchmark: Mid-2025 Top SaaS Vendors](https://www.brex.com/journal/brex-benchmark-may-2025) — Twilio #2 by startup spend
- [Novu GitHub](https://github.com/novuhq/novu) — 38K stars
- [Knock: Top Notification Platforms](https://knock.app/blog/the-top-notification-infrastructure-platforms-for-developers)
- [Postmark: Best Email API](https://postmarkapp.com/blog/best-email-api)

---

### 2. OBSERVABILITY & LOGGING

> Sentry is a launch partner (error tracking/APM). These cover the broader observability stack.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 6 | **Datadog** | Full-stack observability | Surged into Brex top-5 with 50% MoM increase. Ramp's largest monitoring vendor. G2: 4.5 stars. Acquired Eppo (experimentation) May 2025. | Yes (REST API, Terraform, CLI) | $31/host/mo; public company |
| 7 | **Axiom** | Log management | Native Vercel Marketplace integration. Modern log ingest and analysis. Recommended by Theo/t3gg. Developer-first pricing. | Yes (REST API, CLI, Vercel integration) | Vercel Marketplace partner |
| 8 | **Better Stack** | Uptime + logging | Modern alternative to legacy monitoring. Combines uptime monitoring, logging, and incident management. Growing in indie/startup communities. | Yes (REST API, CLI) | Recommended in r/webdev, indie hacker forums |
| 9 | **Grafana Cloud** | Metrics/logs/traces | 67K+ GitHub stars across Grafana ecosystem. Open-source standard for dashboards. Loki+Grafana+Tempo+Mimir stack. | Yes (HTTP API, Terraform, CLI) | 67K+ GitHub stars |
| 10 | **Checkly** | Synthetic monitoring | Joined Vercel Marketplace observability category alongside Sentry. Monitors API endpoints and browser flows. Developer-first. | Yes (REST API, CLI, Terraform) | Vercel Marketplace partner |

**Primary Sources:**
- [Brex Benchmark: July 2025](https://www.brex.com/journal/brex-benchmark-july-2025) — Datadog surged into top 5
- [Ramp: Top SaaS Vendors November 2025](https://ramp.com/velocity/top-saas-vendors-on-ramp-november-2025) — Datadog largest monitoring vendor
- [Vercel Changelog: Sentry, Checkly, Dash0 join Marketplace](https://vercel.com/changelog/sentry-checkly-and-dash0-join-the-vercel-marketplace)
- [Axiom Vercel Integration](https://axiom.co/vercel)

---

### 3. HOSTING & COMPUTE

> Vercel is a launch partner. These expand hosting/compute options.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 11 | **Cloudflare** (Workers/Pages/R2/D1) | Edge compute + storage | Zero egress fees on R2. 330+ edge PoPs. D1 (SQLite at edge), KV, Workers AI. Free 100K req/day. Dominant in edge computing. | Yes (wrangler CLI, REST API, Terraform) | Public company; zero-egress disruption |
| 12 | **Railway** | Container hosting | One-click DB deploy. Usage-based pricing ($5/mo hobby). Popular among indie hackers. Docker container runtime. Growing Reddit presence. | Yes (railway CLI, REST API) | Strong indie hacker adoption |
| 13 | **Fly.io** | Global micro-VMs | Globally distributed micro-VMs. Excellent for backends and globally-distributed apps. Container-based. Upstash Redis integration. | Yes (flyctl CLI, REST API) | 3K+ GitHub stars (flyctl) |
| 14 | **Render** | Heroku alternative | Auto-deploy from Git. Strong as Heroku replacement for small teams. Blueprint spec for declarative infra. | Yes (REST API, Blueprint spec) | Heroku migration wave beneficiary |
| 15 | **Coolify** | Self-hosted PaaS | 35K+ GitHub stars. Open-source self-hosted alternative. 280+ one-click services. No vendor lock-in. Appeals to sovereignty-minded devs. | Yes (API, Docker-native, Git integration) | 35K+ GitHub stars; OSS |
| 16 | **Netlify** | Jamstack hosting | Full integration catalog (CMS, DB, commerce, identity, monitoring). Deploy previews per PR. Serverless functions. Major ecosystem player. | Yes (netlify CLI, REST API) | Major platform; rich integration catalog |

**Primary Sources:**
- [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) — Zero egress pricing
- [Coolify GitHub](https://github.com/coollabsio/coolify) — 35K+ stars
- [GuidJar: 12 Best Vercel Alternatives 2025](https://www.guidejar.com/blog/12-best-vercel-alternatives-for-developers-in-2025)
- [Netlify Integrations](https://www.netlify.com/integrations/all/)
- [Stack Overflow 2025 Survey](https://survey.stackoverflow.co/2025/technology) — Docker 71% usage

---

### 4. DATABASE

> Supabase and Neon are launch partners. These expand database options across SQL, NoSQL, edge, and vector.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 17 | **Upstash** | Serverless Redis/Kafka/QStash | Vercel Marketplace native integration (powers Vercel KV). Serverless Redis + message queue. HTTP-based. Terraform/Pulumi support. | Yes (upstash CLI, Developer API, Terraform) | Vercel Marketplace partner |
| 18 | **Turso** | Edge SQLite (libSQL) | 12K+ GitHub stars. SQLite at the edge via libSQL fork. Multi-tenant. Vector search support. Netlify integration. | Yes (turso CLI, REST API) | 12K+ GitHub stars; Netlify partner |
| 19 | **PlanetScale** | Serverless MySQL | Built on Vitess. Branching workflow. Launched PostgreSQL offering in 2025 + vector support GA. Database branching pioneer. | Yes (pscale CLI, REST API) | Vitess-based; enterprise-grade |
| 20 | **MongoDB Atlas** | Document database | #1 NoSQL. Vercel Marketplace and Netlify native integration. 26K+ GitHub stars (server). Atlas managed service. | Yes (mongosh CLI, Atlas API, Terraform) | 26K+ GitHub stars; public company |
| 21 | **CockroachDB** | Distributed SQL | 30K+ GitHub stars. PostgreSQL-compatible. Distributed by default. Vector indexing in v25.2. Netlify integration. | Yes (CLI, REST API, Terraform) | 30K+ GitHub stars |
| 22 | **SurrealDB** | Multi-model DB | 28K+ GitHub stars. Serverless, distributed. Multi-model: document + graph + relational. Emerging darling on Reddit/HN. | Yes (REST API, CLI, SDKs) | 28K+ GitHub stars; high community buzz |

**Primary Sources:**
- [Vercel: Integrated billing for Supabase, Redis, and EdgeDB](https://vercel.com/changelog/integrated-billing-for-supabase-redis-and-edgedb) — Upstash native integration
- [Turso GitHub (libSQL)](https://github.com/tursodatabase/libsql) — 12K+ stars
- [Toolstac: Database Platform Comparison](https://toolstac.com/compare/planetscale/supabase/neon/xata/turso/cockroachdb/developer-focused-comparison)
- [MongoDB Atlas Vercel Integration](https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/)

---

### 5. STORAGE & FILE MANAGEMENT

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 23 | **Cloudinary** | Image/video management + CDN | AI-powered transforms. Netlify integration partner. Industry standard for media management. | Yes (REST API, SDKs, CLI) | Netlify/Vercel ecosystem |
| 24 | **UploadThing** | TypeScript file uploads | 4K+ GitHub stars (MIT). TypeScript-first. S3 under the hood. Supports Next.js, Astro, Svelte, Nuxt. Created by Theo (t3gg). | Yes (npm SDK, REST API) | 4K+ stars; T3 ecosystem endorsement |
| 25 | **MinIO** | S3-compatible object storage | 50K+ GitHub stars. Self-hosted S3-compatible. High-performance. Appeals to sovereignty/self-hosting crowd. | Yes (CLI, REST API, S3-compatible) | 50K+ GitHub stars; OSS |

**Primary Sources:**
- [Cloudinary Netlify Integration](https://www.netlify.com/integrations/) — Listed in Netlify catalog
- [UploadThing GitHub](https://github.com/pingdotgg/uploadthing) — Created by Theo/t3gg
- [DigitalOcean: 10 Best Object Storage Solutions](https://www.digitalocean.com/resources/articles/object-storage-solutions-cloud-data)

---

### 6. AUTHENTICATION & IDENTITY

> Clerk is a launch partner. These provide alternatives and complementary auth.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 26 | **Auth0** (Okta) | Enterprise auth | Enterprise leader. SOC 2, HIPAA. 9K+ GitHub stars (SDK). 7,500 free MAUs. Terraform provider. Netlify integration. | Yes (Management API, auth0-cli, Terraform) | 9K+ GitHub stars; enterprise standard |
| 27 | **Better Auth** | Framework-agnostic auth library | 7K+ GitHub stars, growing rapidly. TypeScript-first. Plugin ecosystem. Rising challenger to NextAuth. Community buzz on Reddit/X. | Yes (npm library) | 7K+ stars; fastest-growing auth lib |
| 28 | **Kinde** | Developer-friendly auth | Growing alternative with free tier. Developer-friendly. Good startup program. Rising on Product Hunt. | Yes (REST API, SDKs) | Growing indie adoption |

**Primary Sources:**
- [DEV: 7 Best Authentication Frameworks 2025](https://dev.to/syedsakhiakram66/7-best-authentication-frameworks-for-2025-free-paid-compared-159g)
- [Kinde: Top Authentication Providers 2025](https://kinde.com/comparisons/top-authentication-providers-2025/)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)

---

### 7. PAYMENTS & BILLING

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 29 | **Stripe** | Payments | Industry standard. 2.9%+30c. CLI (`stripe`), REST API, Terraform provider. Vercel Marketplace partner. Acquired Lemon Squeezy (2024). | Yes (stripe CLI, REST API, Terraform) | Dominant; Vercel Marketplace partner |
| 30 | **Polar** | Open-source monetization | 3K+ GitHub stars. 4%+40c all-inclusive. Developer-first. Next.js adapter. Open-source. Appeals to OSS/indie hacker community. | Yes (REST API, SDK) | 3K+ GitHub stars; OSS-friendly |
| 31 | **Paddle** | Merchant of Record | MoR included (handles tax/compliance). 5%+50c. SaaS-focused subscription management. Popular among SaaS builders. | Yes (REST API, SDKs) | MoR positioning for SaaS |

**Primary Sources:**
- [Vercel: Marketplace integrations in v0](https://vercel.com/changelog/vercel-marketplace-integrations-now-available-in-v0) — Stripe as Vercel partner
- [Supastarter: SaaS Payment Providers Comparison](https://supastarter.dev/blog/saas-payment-providers-stripe-lemonsqueezy-polar-creem-comparison)
- [BoilerplateKit: Stripe vs Lemon Squeezy vs Polar](https://boilerplatekit.com/blog/lemonsqueezy-vs-stripe-vs-polar)

---

### 8. VOICE & SPEECH AI

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 32 | **Deepgram** | Speech-to-text | Brex top-50 fastest-growing (+127% YoY). Nova-3 model: 6.84% WER. $0.0043/min. $200 free credits. On-prem available. Jumped 5 spots on Brex. | Yes (REST API, SDKs) | +127% YoY (Brex Benchmark) |
| 33 | **ElevenLabs** | Text-to-speech/voice synthesis | Brex top-10 startup AI tool. Flash v2.5: 75ms latency. 32 languages. VPC deploy for enterprise. Industry-leading quality. | Yes (REST API, SDKs) | Top-10 Brex startup AI spend |
| 34 | **LiveKit** | Real-time voice/video infrastructure | 12K+ GitHub stars. Open-source voice/video infra. Agent orchestration for voice AI. WebRTC-based. | Yes (API, SDKs, self-host) | 12K+ GitHub stars; OSS |
| 35 | **AssemblyAI** | Speech understanding | STT + speech understanding. Slam-1 model. Sentiment analysis, PII detection built-in. $50 free credit. | Yes (REST API, SDKs) | Strong developer documentation |
| 36 | **Cartesia** | Low-latency TTS | Sonic TTS: 90ms latency. Best value for voice agent builders. Newer but fast-growing. | Yes (API, SDKs) | Voice agent specialist |

**Primary Sources:**
- [Brex Benchmark: 50 Fastest-Growing Vendors December 2025](https://www.brex.com/journal/brex-benchmark-december-2025) — Deepgram +127% YoY
- [Brex Benchmark: August 2025](https://www.brex.com/journal/brex-benchmark-august-2025) — ElevenLabs top-10
- [LiveKit GitHub](https://github.com/livekit/livekit) — 12K+ stars
- [Tavus: Best AI Voice APIs 2025](https://www.tavus.io/post/ai-voice-api)

---

### 9. TASK MANAGEMENT, WORKERS & BACKGROUND JOBS

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 37 | **Inngest** | Serverless event-driven workflows | 5K+ GitHub stars. Zero infra. 100M+ daily executions. 10K+ Next.js devs. TypeScript/Python/Go SDKs. Event-driven functions. | Yes (REST API, SDK, self-host) | 5K+ stars; 100M+ daily executions |
| 38 | **Trigger.dev** | TypeScript background jobs | 10K+ GitHub stars. TypeScript-first. No timeouts. Managed compute. "Easier Temporal." Long-running job support. | Yes (SDK, CLI, managed platform) | 10K+ GitHub stars |
| 39 | **BullMQ** | Redis-backed job queue | 6K+ GitHub stars (MIT). Rewrite of Bull. Redis-backed. Rate limiting. Node.js + Python. Self-hosted. | Yes (npm library, self-host with Redis) | 6K+ stars; MIT licensed |
| 40 | **Temporal** | Durable execution | 12K+ GitHub stars. Enterprise durable execution engine. Multi-language. Forked from Uber Cadence. Cloud + self-host. | Yes (CLI, SDKs, self-host or Cloud) | 12K+ stars; enterprise-grade |

**Primary Sources:**
- [Inngest](https://www.inngest.com/) — 100M+ daily executions
- [Trigger.dev](https://trigger.dev) — 10K+ GitHub stars
- [Medium: TypeScript Orchestration Guide](https://medium.com/@matthieumordrel/the-ultimate-guide-to-typescript-orchestration-temporal-vs-trigger-dev-vs-inngest-and-beyond-29e1147c8f2d)
- [BullMQ GitHub](https://github.com/taskforcesh/bullmq)

---

### 10. SEARCH

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 41 | **Meilisearch** | Hybrid keyword+vector search | 54K+ GitHub stars. Rust-based. OpenAI/HuggingFace embeddings integration. $30/mo Build tier. Developer-friendly. | Yes (REST API, SDKs, Docker) | 54K+ GitHub stars |
| 42 | **Typesense** | Low-latency search | 24K+ GitHub stars. C++. <50ms results. Free self-hosted. Managed from $19/mo. Strong OSS community. | Yes (REST API, SDKs, self-host) | 24K+ GitHub stars |
| 43 | **Algolia** | Managed search | 1.75T searches/yr. NeuralSearch (keyword+vector). Free 10K searches/mo. Industry standard for product search. | Yes (REST API, SDKs, dashboard) | 1.75T searches/yr |

**Primary Sources:**
- [Typesense: Comparison with Alternatives](https://typesense.org/typesense-vs-algolia-vs-elasticsearch-vs-meilisearch/)
- [Meilisearch: Algolia vs Typesense](https://www.meilisearch.com/blog/algolia-vs-typesense)
- [Meilisearch GitHub](https://github.com/meilisearch/meilisearch) — 54K+ stars

---

### 11. FEATURE FLAGS & EXPERIMENTATION

> PostHog (launch partner) has feature flags built in. These are dedicated solutions.

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 44 | **LaunchDarkly** | Feature flags | Enterprise leader. Billions of evaluations daily. Vercel Marketplace native integration (Edge Config). Terraform provider. | Yes (REST API, SDKs, CLI, Terraform) | Enterprise leader; Vercel partner |
| 45 | **GrowthBook** | OSS feature flags + A/B testing | 6K+ GitHub stars. Bayesian stats engine. Feature flags + A/B testing. Self-host or managed. | Yes (REST API, SDK, self-host) | 6K+ GitHub stars; OSS |

**Primary Sources:**
- [LaunchDarkly Vercel Integration](https://docs.launchdarkly.com/integrations/vercel)
- [PostHog: Best Open Source Feature Flag Tools](https://posthog.com/blog/best-open-source-feature-flag-tools)
- [Flagsmith: Top 7 Feature Flag Tools 2025](https://www.flagsmith.com/blog/top-7-feature-flag-tools)

---

### 12. CMS & CONTENT MANAGEMENT

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 46 | **Sanity** | Headless CMS | #1 on G2 for 4 years. Real-time collab. Schema as code. Content Lake. Generous free tier. Vercel + Netlify partner. | Yes (REST API, GROQ, CLI, SDK) | #1 G2 headless CMS |
| 47 | **Payload CMS** | Code-first headless CMS | 30K+ GitHub stars (steepest growth). TypeScript-first. Native Next.js. MIT licensed. Fastest-growing CMS by GitHub stars since mid-2025. | Yes (REST API, GraphQL, CLI, self-host) | 30K+ stars; fastest growth |
| 48 | **Strapi** | Open-source headless CMS | 60K+ GitHub stars. 350+ plugins. Strapi 5 in 2025. Cloud from $15/mo. Largest OSS CMS community. | Yes (REST API, GraphQL, CLI, self-host) | 60K+ GitHub stars; OSS leader |

**Primary Sources:**
- [Sanity: Top 5 Headless CMS 2025 on G2](https://www.sanity.io/top-5-headless-cms-platforms-2025)
- [Pooya Blog: Payload vs Strapi vs Sanity](https://pooya.blog/blog/headless-cms-consultancy/)
- [Strapi: Celebrating 50K GitHub Stars](https://strapi.io/blog/celebrating-50k-github-stars)

---

### 13. VECTOR DATABASE & AI INFRASTRUCTURE

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 49 | **Pinecone** | Managed vector DB | Managed-first, serverless. $130M+ raised. Free tier. Industry standard for RAG/embedding search. | Yes (REST API, SDKs) | $130M+ raised; market leader |
| 50 | **Qdrant** | OSS vector DB | 9K+ GitHub stars. Rust-based. 1GB free forever. Great for cost-sensitive deployments. | Yes (REST API, gRPC, SDKs) | 9K+ stars; Rust performance |
| 51 | **Weaviate** | Hybrid vector search | 8K+ GitHub stars. Strong hybrid search. >1M Docker pulls/mo. OSS + managed. | Yes (REST API, GraphQL, SDKs) | 8K+ stars; >1M Docker pulls/mo |
| 52 | **OpenRouter** | AI model routing | Brex #2 fastest-growing vendor (+1,500% YoY). Routes requests across LLM providers. Critical AI infrastructure layer. | Yes (REST API, OpenAI-compatible) | +1,500% YoY (Brex top-50) |

**Primary Sources:**
- [Brex Benchmark: 50 Fastest-Growing December 2025](https://www.brex.com/journal/brex-benchmark-december-2025) — OpenRouter +1,500% YoY
- [Firecrawl: Best Vector Databases 2025](https://www.firecrawl.dev/blog/best-vector-databases-2025)
- [LiquidMetal AI: Vector Database Comparison](https://liquidmetal.ai/casesAndBlogs/vector-comparison/)

---

### 14. CI/CD & DEVOPS

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 53 | **GitHub Actions** | CI/CD workflows | Most popular CI/CD. Free for public repos. 2000 min/mo free for private. 81% usage (SO survey). Universal Git integration. | Yes (YAML config, REST API, gh CLI) | 81% dev usage (SO 2025) |
| 54 | **Pulumi** | Infrastructure as code | Modern IaC using real programming languages (TS, Python, Go). 150+ providers. Automation API for programmatic infra. Open-source CLI. | Yes (pulumi CLI, Automation API, SDK) | OSS; real-language IaC |

**Primary Sources:**
- [Stack Overflow 2025 Developer Survey](https://survey.stackoverflow.co/2025/technology) — GitHub 81% collaboration usage
- [Spacelift: Top 12 Cloud Provisioning Tools](https://spacelift.io/blog/cloud-provisioning-tools) — Pulumi featured

---

### 15. ORM & DATA ACCESS

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 55 | **Drizzle ORM** | TypeScript-first ORM | 32K+ GitHub stars, 2.3M weekly npm downloads. SQL-first. Serverless/edge optimized (~7kb). Supports Neon, PlanetScale, Turso, Supabase, Cloudflare D1. | Yes (npm library, drizzle-kit CLI) | 32K+ stars; 2.3M weekly downloads |
| 56 | **Prisma** | Schema-first ORM | 45K+ GitHub stars, 5.1M weekly npm downloads. Prisma Postgres via Vercel Marketplace. Prisma Accelerate. Studio GUI. | Yes (prisma CLI, REST API, Vercel Marketplace) | 45K+ stars; 5.1M weekly downloads |

**Primary Sources:**
- [npm trends: drizzle-orm vs prisma](https://npmtrends.com/drizzle-orm-vs-prisma)
- [Prisma Postgres via Vercel Marketplace](https://www.prisma.io/docs/postgres/integrations/vercel)
- [Bytebase: Drizzle vs Prisma 2025](https://www.bytebase.com/blog/drizzle-vs-prisma/)

---

### 16. CRON, SCHEDULING & SERVERLESS UTILITIES

| # | Partner | Sub-Category | Evidence | API/CLI Ready | Key Metrics |
|---|---------|-------------|----------|--------------|-------------|
| 57 | **Upstash QStash** | Serverless message queue | HTTP-based message queue. Scheduled/delayed messages. Pairs with Upstash Redis. Serverless-native. | Yes (REST API, SDK) | Part of Upstash ecosystem |

*Note: QStash is listed separately from Upstash Redis (#17) as it represents a distinct primitive (async messaging/scheduling vs. caching/data store), though a partnership with Upstash could cover both.*

---

## Summary by Primitive

| Primitive | Count | Partners |
|-----------|-------|----------|
| Transactional Email & Comms | 5 | Twilio, Novu, Knock, SendGrid, Postmark |
| Observability & Logging | 5 | Datadog, Axiom, Better Stack, Grafana Cloud, Checkly |
| Hosting & Compute | 6 | Cloudflare, Railway, Fly.io, Render, Coolify, Netlify |
| Database | 6 | Upstash, Turso, PlanetScale, MongoDB Atlas, CockroachDB, SurrealDB |
| Storage & Files | 3 | Cloudinary, UploadThing, MinIO |
| Auth & Identity | 3 | Auth0, Better Auth, Kinde |
| Payments & Billing | 3 | Stripe, Polar, Paddle |
| Voice & Speech AI | 5 | Deepgram, ElevenLabs, LiveKit, AssemblyAI, Cartesia |
| Workers & Background Jobs | 4 | Inngest, Trigger.dev, BullMQ, Temporal |
| Search | 3 | Meilisearch, Typesense, Algolia |
| Feature Flags | 2 | LaunchDarkly, GrowthBook |
| CMS | 3 | Sanity, Payload CMS, Strapi |
| Vector DB & AI Infra | 4 | Pinecone, Qdrant, Weaviate, OpenRouter |
| CI/CD & DevOps | 2 | GitHub Actions, Pulumi |
| ORM & Data Access | 2 | Drizzle ORM, Prisma |
| Cron & Scheduling | 1 | Upstash QStash |
| **TOTAL** | **57** | |

---

## SELF-CRITIQUE

### Issues with the Initial List

**1. Provisioning Feasibility Gaps**
- **GitHub Actions** (#53): Not a SaaS you "provision" — it's a feature of GitHub. Unclear what account creation means here. The CLI partner should be the thing you activate, not a CI workflow.
- **BullMQ** (#39): This is an npm library, not a SaaS. No account to provision. Requires self-hosting Redis. Doesn't fit the "activate via CLI" model.
- **MinIO** (#25): Self-hosted only. No managed service to provision. Doesn't fit the SaaS provisioning model.
- **Coolify** (#15): Self-hosted PaaS. Similar problem — no hosted account to provision.
- **Grafana Cloud** (#9): While Grafana has a cloud offering, the OSS project is what most devs use. Cloud provisioning API exists but is less mature.

**2. Category Redundancy / Overlap with Launch Partners**
- **Auth0** (#26): Strong pick, but overlaps heavily with Clerk (launch partner). Only include if the CLI wants to offer auth "choice."
- **SendGrid** (#4): Owned by Twilio (#1). Including both is redundant unless Twilio is positioned as voice/SMS only.
- **Upstash + QStash** (#17, #57): Could be a single partnership covering both Redis and messaging.

**3. Missing High-Signal Categories**
- **No real-time / WebSocket provider** — Ably, Pusher, or Soketi are conspicuously absent. Real-time is a core primitive.
- **No DNS/domain management** — Namecheap, Porkbun, or Cloudflare Registrar. Domain provisioning is day-zero infrastructure.
- **No error budget/SRE tooling** — PagerDuty, Opsgenie, or incident.io for alerting.
- **No email marketing/transactional** — Customer.io, Loops.so for product-led email.
- **No forms/data collection** — Tally, Typeform API.

**4. Velocity / Recency Concerns**
- **SurrealDB** (#22): High GitHub stars but unclear production adoption. Community excitement may not translate to actual usage among target customers.
- **Cartesia** (#36): Very new, limited adoption data. High-conviction pick but risky.
- **Better Auth** (#27): Growing fast but very new. Production readiness unclear.
- **Polar** (#30): Small community. May not have the API maturity for automated provisioning.

**5. API Provisioning Readiness Reality Check**
Several tools on this list have APIs for *using* the service but not for *creating accounts/projects programmatically*:
- **Clerk** (existing partner): Dashboard-only project creation. No API for it.
- **Paddle** (#31): Account creation is manual. API is for transactions, not provisioning.
- **Algolia** (#43): App creation may be dashboard-only.

This is a critical distinction for the CLI: you need partners whose API supports `create-project` or `create-organization` endpoints, not just data plane APIs.

---

## REGENERATED LIST (v2)

After applying the critique, here is the refined list of **50 partners**, removing unfit candidates and adding missing primitives.

### Removed (7)
- **GitHub Actions** — Not a provisionable SaaS
- **BullMQ** — npm library, not a SaaS to provision
- **MinIO** — Self-hosted only, no managed account to provision
- **Coolify** — Self-hosted PaaS, no account provisioning
- **SendGrid** — Redundant with Twilio partnership
- **Upstash QStash** — Consolidated with Upstash Redis as single partner
- **Cartesia** — Too new, insufficient adoption data

### Added (6)
- **Ably** — Real-time messaging/WebSocket infrastructure
- **PagerDuty** — Incident management & alerting
- **Loops** — Developer-first email marketing
- **Dub** — Open-source link management/analytics
- **Convex** — Reactive backend-as-a-service
- **Doppler** — Secrets management

### Consolidated (1)
- **Upstash** — Covers Redis, Kafka, QStash as single partner

---

## FINAL LIST: 50 PARTNERS (v2)

### Tier 1: Highest Conviction (Strong API, High Demand, Clear Fit)

| # | Partner | Primitive | Confidence | Key Evidence |
|---|---------|-----------|------------|-------------|
| 1 | **Stripe** | Payments | Very High | Industry standard; Vercel Marketplace partner; `stripe` CLI; Terraform provider |
| 2 | **Cloudflare** | Edge Compute/Storage/CDN | Very High | Public company; Workers/Pages/R2/D1/KV; `wrangler` CLI; zero-egress |
| 3 | **Twilio** | SMS/Voice/Comms | Very High | #2 Brex startup spend; REST API + CLI; global SMS leader |
| 4 | **Datadog** | Observability | Very High | Top-5 Brex spend; 50% MoM growth; REST API + Terraform + CLI |
| 5 | **MongoDB Atlas** | Document Database | Very High | #1 NoSQL; Vercel + Netlify native; `mongosh` CLI; Atlas API |
| 6 | **LaunchDarkly** | Feature Flags | Very High | Enterprise leader; Vercel Marketplace native; REST API + CLI + Terraform |
| 7 | **Auth0** | Enterprise Auth | Very High | Netlify partner; `auth0-cli`; Terraform provider; 7.5K free MAUs |
| 8 | **Upstash** | Serverless Redis/Kafka/Queue | Very High | Vercel native (KV); `upstash` CLI; Developer API; Terraform/Pulumi |
| 9 | **Prisma** | ORM + Managed Postgres | High | 45K stars; 5.1M npm/wk; Vercel Marketplace (Prisma Postgres); `prisma` CLI |
| 10 | **Sanity** | Headless CMS | High | #1 G2 4 years; schema as code; Vercel + Netlify partner; CLI |

### Tier 2: Strong Conviction (Good API, Proven Demand)

| # | Partner | Primitive | Confidence | Key Evidence |
|---|---------|-----------|------------|-------------|
| 11 | **Deepgram** | Speech-to-Text | High | +127% YoY Brex; Nova-3 model; REST API + SDKs; $200 free credits |
| 12 | **ElevenLabs** | Text-to-Speech | High | Brex top-10 AI; 75ms latency; REST API + SDKs; 32 languages |
| 13 | **Railway** | Container Hosting | High | `railway` CLI; REST API; one-click DB deploy; strong indie adoption |
| 14 | **Inngest** | Serverless Background Jobs | High | 5K+ stars; 100M+ daily executions; SDK + self-host; event-driven |
| 15 | **Trigger.dev** | TypeScript Background Jobs | High | 10K+ stars; SDK + CLI; managed compute; "easier Temporal" |
| 16 | **Turso** | Edge SQLite | High | 12K+ stars; `turso` CLI; REST API; Netlify partner; edge-native |
| 17 | **Meilisearch** | Search | High | 54K+ stars; Rust; hybrid search; REST API + Docker; $30/mo |
| 18 | **PlanetScale** | Serverless MySQL | High | `pscale` CLI; Vitess-based; branching; added Postgres in 2025 |
| 19 | **Axiom** | Log Management | High | Vercel Marketplace native; REST API + CLI; developer-first |
| 20 | **Fly.io** | Global Micro-VMs | High | `flyctl` CLI; REST API; globally distributed; container-based |

### Tier 3: Good Conviction (Growing Fast, Fits Target Customer)

| # | Partner | Primitive | Confidence | Key Evidence |
|---|---------|-----------|------------|-------------|
| 21 | **Drizzle ORM** | TypeScript ORM | High | 32K+ stars; 2.3M npm/wk; edge-optimized; `drizzle-kit` CLI |
| 22 | **Novu** | Notification Orchestration | High | 38K+ stars (MIT); unified multi-channel; REST API + SDK |
| 23 | **Payload CMS** | Code-first CMS | High | 30K+ stars (steepest growth); TypeScript-first; Next.js native |
| 24 | **Render** | Heroku Replacement | Medium-High | REST API; Blueprint spec; auto-deploy from Git; strong indie presence |
| 25 | **Pinecone** | Vector Database | Medium-High | Market leader; $130M+ raised; REST API + SDKs; free tier |
| 26 | **GrowthBook** | OSS Feature Flags + A/B | Medium-High | 6K+ stars; Bayesian stats; self-host or managed; REST API |
| 27 | **Strapi** | Open-source CMS | Medium-High | 60K+ stars; 350+ plugins; REST + GraphQL + CLI |
| 28 | **Typesense** | Low-latency Search | Medium-High | 24K+ stars; C++; <50ms; REST API + SDKs |
| 29 | **Netlify** | Jamstack Hosting | Medium-High | `netlify` CLI; REST API; rich integration catalog |
| 30 | **CockroachDB** | Distributed SQL | Medium-High | 30K+ stars; PostgreSQL-compatible; CLI + REST API + Terraform |

### Tier 4: Emerging / Strategic (High Potential, Newer)

| # | Partner | Primitive | Confidence | Key Evidence |
|---|---------|-----------|------------|-------------|
| 31 | **LiveKit** | Real-time Voice/Video Infra | Medium-High | 12K+ stars; OSS; voice agent orchestration; API + SDKs |
| 32 | **Ably** | Real-time Messaging/WebSockets | Medium | Enterprise pub/sub; REST API + SDKs; free 6M msgs/mo |
| 33 | **Cloudinary** | Image/Video Management | Medium | REST API + SDKs + CLI; Netlify partner; AI transforms |
| 34 | **OpenRouter** | AI Model Routing | Medium | +1,500% YoY Brex #2 fastest; OpenAI-compatible API; multi-model |
| 35 | **Qdrant** | OSS Vector Database | Medium | 9K+ stars; Rust; 1GB free forever; REST + gRPC |
| 36 | **Weaviate** | Hybrid Vector Search | Medium | 8K+ stars; >1M Docker pulls/mo; REST + GraphQL |
| 37 | **Checkly** | Synthetic Monitoring | Medium | Vercel Marketplace partner; REST API + CLI + Terraform |
| 38 | **AssemblyAI** | Speech Understanding | Medium | REST API + SDKs; Slam-1 model; $50 free; PII detection |
| 39 | **Better Auth** | Framework-agnostic Auth | Medium | 7K+ stars; fast growth; TypeScript; plugin ecosystem |
| 40 | **Temporal** | Durable Execution | Medium | 12K+ stars; enterprise; multi-language; Cloud + self-host |

### Tier 5: Strategic Additions (Missing Primitives)

| # | Partner | Primitive | Confidence | Key Evidence |
|---|---------|-----------|------------|-------------|
| 41 | **Doppler** | Secrets Management | Medium | REST API + CLI; integrates with Vercel, Railway, Netlify; team secrets sync |
| 42 | **PagerDuty** | Incident Management | Medium | REST API + CLI; industry standard alerting; Terraform provider |
| 43 | **Knock** | Notification Workflow | Medium | REST API + SDK; enterprise-grade; batching/digests; $250/mo |
| 44 | **Polar** | OSS Monetization | Medium | 3K+ stars; REST API + SDK; Next.js adapter; developer-first |
| 45 | **Paddle** | Merchant of Record | Medium | REST API + SDKs; MoR (tax handling); SaaS-focused billing |
| 46 | **UploadThing** | File Uploads | Medium | 4K+ stars (MIT); T3 ecosystem; Next.js/Astro/Svelte/Nuxt |
| 47 | **Loops** | Developer Email Marketing | Medium | API-first; product-led email; growing in indie/SaaS community |
| 48 | **Dub** | Link Management/Analytics | Medium | 20K+ stars; OSS; REST API; developer-first short links |
| 49 | **Convex** | Reactive Backend | Medium | Growing fast; real-time sync; TypeScript-first; SDK + CLI |
| 50 | **Postmark** | Premium Email Delivery | Medium | Best deliverability; REST API + SDK; trusted by 1Password, Paddle |
| 51 | **SurrealDB** | Multi-model Database | Medium | 28K+ stars; REST API + CLI; document + graph + relational |
| 52 | **Kinde** | Developer-friendly Auth | Medium | REST API + SDKs; free tier; growing indie adoption |
| 53 | **Better Stack** | Modern Monitoring | Medium | REST API + CLI; uptime + logging combined; indie-friendly pricing |
| 54 | **Algolia** | Managed Search | Medium | REST API + SDKs; 1.75T searches/yr; 10K free searches/mo |
| 55 | **Pulumi** | Infrastructure as Code | Medium | `pulumi` CLI + Automation API; real languages (TS, Python, Go) |

*Note: List includes 55 to provide buffer — recommend prioritizing Tiers 1-3 (30 partners) for initial outreach, then Tier 4-5 as the marketplace matures.*

---

## Prioritized Outreach Strategy

### Wave 1 (Partners 1-10): Foundation primitives every app needs
Payments, edge compute, communications, observability, document DB, feature flags, enterprise auth, serverless cache, ORM, CMS.

### Wave 2 (Partners 11-20): Growth primitives for scaling apps
Voice AI, container hosting, background jobs, edge database, search, log management, global compute.

### Wave 3 (Partners 21-30): Developer experience and specialization
TypeScript ORM, notifications, code-first CMS, Heroku migration, vector DB, experimentation, distributed SQL.

### Wave 4-5 (Partners 31-55): Long tail and emerging categories
Real-time infrastructure, secrets management, incident management, AI model routing, file uploads, developer email, link management, reactive backends.

---

## Key Sources Index

### Corporate Card Spend Data
- [Brex Benchmark: Anthropic Tops Startup AI Spend (May 2025)](https://www.brex.com/journal/brex-benchmark-may-2025)
- [Brex Benchmark: Startup Software Stack Bundling](https://www.brex.com/journal/brex-benchmark-startup-software-stack)
- [Brex Benchmark: Startups Snapping Up AI Infra (July 2025)](https://www.brex.com/journal/brex-benchmark-july-2025)
- [Brex Benchmark: August 2025](https://www.brex.com/journal/brex-benchmark-august-2025)
- [Brex Benchmark: OpenAI Spend Up 80% (October 2025)](https://www.brex.com/journal/brex-benchmark-october-2025)
- [Brex Benchmark: 50 Fastest-Growing Vendors (December 2025)](https://www.brex.com/journal/brex-benchmark-december-2025)
- [Ramp: Top SaaS Vendors - Monthly Reports (Jan-Dec 2025)](https://ramp.com/velocity/top-saas-vendors-on-ramp-december-2025)
- [Ramp: Fall 2025 Business Spending Report](https://ramp.com/velocity/introducing-fall-2025-spend-report)
- [Ramp: AI Index](https://ramp.com/data/ai-index)
- [Ramp: Data-Backed Vendor Directory](https://ramp.com/vendors)
- [Cledara: 2025 Software Spend Report](https://www.cledara.com/blog/2025-software-spend-report)

### Developer Surveys & Adoption Data
- [Stack Overflow 2025 Developer Survey](https://survey.stackoverflow.co/2025/)
- [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)
- [State of JavaScript 2024](https://2024.stateofjs.com/en-US)
- [npm trends](https://npmtrends.com/)

### Marketplace & Integration Catalogs
- [Vercel Marketplace](https://vercel.com/marketplace)
- [Netlify Integrations](https://www.netlify.com/integrations/all/)
- [Startup Credits: All Listings](https://startupcredits.io/all)
- [OpenVC Startup Perks](https://www.openvc.app/perks)

### Growth & Funding
- [PR Newswire: Startups Pour Record Spend Into AI Infrastructure](https://www.prnewswire.com/news-releases/startups-pour-record-spend-into-ai-infrastructure-in-2025-302644559.html)
- [Fortune: AI Startups Attracted Serious Cash](https://fortune.com/2025/12/23/as-ai-investors-fret-over-roi-these-startups-attracted-serious-cash-customers-2025/)
- [PostHog Revenue & Valuation (Sacra)](https://sacra.com/c/posthog/)
- [Amplitude Q2 2025 Financials](https://investors.amplitude.com/news-releases/news-release-details/amplitude-announces-first-quarter-2025-financial-results)
