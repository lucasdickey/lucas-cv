# How the Claude Code Team Uses Claude Code

**By Boris Cherny ([@bcherny](https://x.com/bcherny))** — Creator of Claude Code at Anthropic

> Source: [Original thread on X](https://x.com/bcherny/status/2017742741636321619) | [Boris's personal setup thread](https://x.com/bcherny/status/2007179832300581177)

---

## Context

Boris Cherny created Claude Code as a side project in September 2024. It has since become a core development tool at Anthropic and across the industry. In January 2026, Boris shared his personal workflow. In late January/early February 2026, he followed up with a thread of tips sourced directly from the Claude Code team — the engineers who build and ship the tool every day.

His key framing: **"There is no one right way to use Claude Code. Everyone's setup is different."** What follows is a collection of practices from across the team — experiment and keep what works.

---

## 1. Git Worktrees — The #1 Productivity Unlock

Spin up 3-5 git worktrees, each running its own Claude session. This is described as the **single biggest productivity unlock** from the team.

- Some people set up shell aliases (`za`, `zb`, `zc`) to hop between worktrees in one keystroke
- While Boris himself prefers multiple git checkouts, most of the team has standardized on worktrees
- Team member Adam Morris built native worktree support directly into the Claude Desktop app
- Some engineers maintain a dedicated "analysis" worktree exclusively for reading logs and running BigQuery queries

<!-- Screenshot from thread: Boris showing multiple terminal worktrees -->
<!-- Original image at https://x.com/bcherny/status/2017742741636321619 -->

---

## 2. Plan Mode & Adversarial Review ("Two-Claude Review")

Pour your energy into the plan so Claude can **one-shot the implementation**.

- Start every complex task in Plan mode (`Shift+Tab` twice)
- Go back and forth with Claude until the plan looks right
- If something goes sideways, switch back to Plan mode and re-plan — don't push through
- **Two-Claude pattern**: Claude A writes the plan, Claude B reviews it like a staff engineer with fresh context and less bias

### Prompting Techniques

- Challenge Claude: *"Grill me on these changes and don't make a PR until I pass your test."*
- After a mediocre fix: *"Knowing everything you know now, scrap this and implement the elegant solution."*

---

## 3. CLAUDE.md as Compounding Memory

Their team shares a **single CLAUDE.md** for the Claude Code repo, checked into git, with the whole team contributing multiple times a week.

- Anytime they see Claude do something incorrectly, they add it to the CLAUDE.md
- After every correction, tell Claude: **"Update your CLAUDE.md so you don't make that mistake again."**
- Claude is "eerily good at writing rules for itself"
- Keep iterating until Claude's mistake rate measurably drops
- **Prune CLAUDE.md aggressively over time** — don't let it become bloated

During code review, Boris tags `@claude` on coworkers' PRs to add to CLAUDE.md as part of the PR, using the Claude Code GitHub action. This is their version of "Compounding Engineering."

---

## 4. Subagents

Say **"use subagents"** when you want Claude to throw more compute at a problem.

- Offload tasks to subagents to keep your main context window clean
- Subagents are ideal for high-volume operations: test output, logs, deep code searches, parallel investigation
- Boris uses subagents regularly:
  - **code-simplifier** — simplifies code after Claude is done working
  - **verify-app** — detailed instructions for end-to-end testing
  - **build-validator** — deployment build verification
- Think of subagents as automating the most common workflows for PRs
- You can route permission requests to Opus 4.5 via a hook to auto-approve safe ones

---

## 5. Terminal & Workflow Setup

The team loves **Ghostty** (multiple people independently chose it).

- Use `/statusline` to show context usage and git branch
- Color-code your terminal tabs
- One tab per task/worktree (sometimes via tmux)
- Boris runs **5 parallel Claudes** in numbered terminal tabs (1-5), using system notifications to know when a Claude needs input
- He also runs **5-10 more Claudes on claude.ai/code** in parallel, handing off sessions between local and web using `&` or `--teleport`

<!-- Screenshot from thread: Boris's terminal with 5 numbered Claude tabs -->
<!-- Original image at https://x.com/bcherny/status/2007179832300581177 -->

---

## 6. Voice Dictation

Use voice dictation — **you speak 3x faster than you type**.

- On macOS: hit `fn` twice to activate dictation
- The bottleneck in AI-assisted development is often the quality and detail of human input, not the AI's processing capability
- More detailed prompts lead to better results; voice makes detailed prompting effortless

---

## 7. Slash Commands & Custom Skills

If you do something more than once a day, turn it into a skill or slash command.

- Commands are checked into git in `.claude/commands/`
- Boris uses `/commit-push-pr` dozens of times daily
- Other team examples:
  - `/techdebt` — hunts duplication at the end of sessions
  - A "context dump" skill that syncs recent Slack/GDrive/Asana/GitHub into one context window

---

## 8. Database & Analytics via CLI

Use Claude with the **bq CLI** (or any database CLI/MCP/API) to pull and analyze metrics.

- Boris says he hasn't written a line of SQL in 6+ months
- Claude searches Slack (via MCP server), runs BigQuery queries, grabs error logs from Sentry, etc.
- The Slack MCP configuration is checked into `.mcp.json` and shared with the team

---

## 9. Verification — The Force Multiplier

**Probably the most important thing to get great results**: give Claude a way to verify its work.

- If Claude has a feedback loop, it will **2-3x the quality** of the final result
- Claude tests every change landed to claude.ai/code using the Chrome extension — it opens a browser, tests the UI, and iterates
- Verification looks different for each domain:
  - Running bash commands
  - Running test suites
  - Testing in a browser or phone simulator
- Invest in making verification rock-solid

---

## 10. Bug Fixing & Delegation

Don't micromanage. Give Claude the context and let it figure out the how.

- Paste a Slack bug thread into Claude and just say **"fix"**
- Or say **"Go fix the failing CI tests"**
- Point Claude at docker logs to troubleshoot distributed systems
- For long-running tasks, use background agent verification, agent Stop hooks, or the `ralph-wiggum` plugin

---

## 11. Learning Mode

Enable the **"Explanatory" or "Learning" output style** in `/config` to have Claude explain the why behind its changes.

- Have Claude generate visual HTML presentations
- Draw ASCII diagrams of codebases
- Build a spaced-repetition learning skill

---

## 12. Model Choice

Boris uses **Opus 4.5 with thinking** for everything.

> "It's the best coding model I've ever used, and even though it's bigger & slower than Sonnet, since you have to steer it less and it's better at tool use, it is almost always faster than using a smaller model in the end."

---

## The Key Takeaway

The ingredients are almost boring: **worktrees, clear prompts, and verification steps that do not get skipped**. The difference is how the work is structured. Instead of treating AI like a chat you have to babysit, the workflow turns Claude into parallel execution that you check in on only when judgment is needed.

Boris's stats in a single 30-day period: **259 PRs, 497 commits, 40k lines added, 38k lines removed** — every single line written by Claude Code + Opus 4.5.

---

## Boris's Configuration (Community-Maintained)

A community-maintained repo replicates Boris's configuration: [0xquinto/bcherny-claude](https://github.com/0xquinto/bcherny-claude)

**Slash Commands:**
- `/commit-push-pr` — Full git workflow automation
- `/quick-commit` — Fast staging and committing
- `/test-and-fix` — Test execution and repair
- `/review-changes` — Code improvement suggestions
- `/first-principles` — Fundamental problem deconstruction

**Subagents:**
- `code-simplifier` — Code cleanup post-work
- `code-architect` — Design and architecture reviews
- `verify-app` — Thorough application testing
- `build-validator` — Deployment build verification
- `oncall-guide` — Production issue diagnostics

---

## Sources

- [Boris's personal setup thread (Jan 2, 2026)](https://x.com/bcherny/status/2007179832300581177)
- [Claude Code team tips thread (Late Jan 2026)](https://x.com/bcherny/status/2017742741636321619)
- [Threads version of personal setup](https://www.threads.com/@boris_cherny/post/DTBVlMIkpcm/)
- [Threads version of team tips](https://www.threads.com/@boris_cherny/post/DUMZr4VElyb/)
- [Community config repo](https://github.com/0xquinto/bcherny-claude)

> **Note:** Images from the original X threads could not be embedded directly due to platform access restrictions. Visit the original thread links above to see Boris's screenshots of his terminal setup, worktree configurations, and slash command examples.
