# Tool And Provider Guides

This document keeps static decision material as documentation instead of fake runnable packages.

## Codex Surface Decision

Choose by evidence:

| Need | Prefer |
|---|---|
| Project workbench, files, diff, terminal, browser, review in one place | Codex App |
| Commands, logs, repeatable local checks | Codex CLI |
| Current file, selected code, local refactor | IDE |
| Page rendering, clicking, layout, console errors | Browser |
| Diff risk before commit | Review |

Do not pick by habit. Pick by the evidence the task needs.

## Codex And Claude Code

Use the same AI coding process:

```text
idea -> spec -> context -> plan -> implementation -> verification -> review -> retro
```

Positioning:

| Area | Codex | Claude Code |
|---|---|---|
| Beginner workbench | App, diff, terminal, browser, review | Not the first beginner surface |
| Terminal flow | CLI commands | Claude Code CLI |
| Durable rules | `AGENTS.md` | `CLAUDE.md` |
| Repeatable checks | Review, Browser, CLI commands | Hooks, CLI commands, project rules |
| Page verification | in-app Browser / Chrome extension | External browser or workflow-specific verification |

Boundary:

```text
AGENTS.md and CLAUDE.md are context, not hard enforcement.
Hooks are for deterministic checks, not business decisions.
Subagents are for bounded side tasks, not unmanaged parallel work.
Advanced tool connections are optional. Learn permissions and data boundaries before adding them.
```

## Cursor, OpenCode, Gemini CLI

| Tool | Put It Here | Good For | Do Not Use It For |
|---|---|---|---|
| Cursor | Editor collaboration | Current file, selected code, local refactor, small tests | Replacing spec, plan, and verification |
| OpenCode | Optional terminal route | Provider control, open-source workflow experiments | Assuming provider compatibility means engineering stability |
| Gemini CLI | Optional Google model route | Another model perspective, terminal tasks | Beginner first step before command-line basics |

Migration rule:

```text
Move the process, not the shortcut.
Spec, context, plan, verification, and review stay the same across tools.
```

## Provider Route Decision

Check provider readiness by layers:

```text
account
minimal-chat
responses-or-equivalent
codex-provider
real-project
small-product-workflow
```

What each layer proves:

| Layer | Proves | Does Not Prove |
|---|---|---|
| account | Account, API key, base URL, billing or quota are available | Any model call works |
| minimal-chat | A small Chat Completions style call can return text | Responses API, tools, Codex provider, long tasks |
| responses-or-equivalent | The provider has an agent-friendly API layer or equivalent route | Codex workflow stability |
| codex-provider | Codex can be configured to talk to the provider | Real project edits are stable |
| real-project | A real repo task can be edited, tested, and verified | Long-term use is governed |
| small-product-workflow | Logs, cost, quota, audit, and fallback are planned | The provider will never fail |

For beginner learning, prefer the route with the fewest setup steps first. For low-cost practice, use domestic Chat-compatible providers after proving the minimal call. For long-term product use, do not skip logs, quota, fallback, and cost checks.
