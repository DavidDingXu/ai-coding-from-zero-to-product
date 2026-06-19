# Vibe Practice Route

This document keeps the ordinary-person product practice route in the open-source repo without turning the overview lessons into fake runnable projects.

## Main Product

The practice line uses one product idea: AI personal productivity assistant.

First version:

```text
Input tasks, schedule items, notes, and lightweight expense records.
Generate today's action cards with priority, reason, and next action.
Support filtering, copying, and local save in the MVP.
```

Out of scope for the first version:

```text
Real reminders
Real payment or transfer
Automatic access to contacts, calendar, or bills
Team approval
Enterprise productivity suite
```

## Project Route

| Project | Purpose | MVP Evidence | Production Gap |
|---|---|---|---|
| `web-landing` | Explain the product and collect early feedback | Page opens, form validates, feedback can be captured locally | Real form backend, privacy page, analytics |
| `web-app` | Run the core planning workflow | Input, generation, filtering, copy, and local save work | Model proxy, account, remote storage, quota |
| `h5-miniapp` | Compress the workflow to mobile | Mobile-sized flow works with short input and local favorites | Real device verification, H5 deploy path, mini program review material |
| `browser-extension` | Capture web page material into note cards | Current page title, URL, selected text, and local card work | Permission minimization, sensitive page exclusion, export/delete |
| `light-backend` | Introduce data, API, ownership, and audit boundaries | API contract, session simulation, permissions, and audit events work | Database migration, backup, auth, rate limits, deploy/rollback |
| `deployment` | Choose a deploy path for the demo | Build output, environment variables, deploy checklist, rollback notes | Domain, monitoring, staging, repeatable release |
| `seo-analytics` | Make the product findable and measurable | Title, description, share text, basic event plan | Search Console, analytics pipeline, content iteration |
| `commercialization` | Turn product usage into account and quota thinking | Plan table, quota rules, simulated billing state | Real account system, invoices, risk control |
| `payment-sandbox` | Practice payment flow without real money | Order state machine, callback simulation, refund state | Real provider review, reconciliation, compliance |
| `feedback-loop` | Convert user feedback into the next AI coding task | Feedback intake, triage, next spec, verification target | Roadmap, support workflow, churn/retention metrics |

## How To Use This Route

For a new product, do not copy every module. Pick the first shape by the first user action:

```text
Need to explain value first -> landing page
Need to run a core workflow -> web app
Need a short mobile action -> H5 / mini app shape
Need to collect web material -> browser extension
Need user data and ownership -> light backend
Need to share with real users -> deployment
Need people to find it -> SEO / analytics
Need to test willingness to pay -> commercialization / payment sandbox
Need to keep improving -> feedback loop
```

Before asking AI to write code, write:

```text
Target user
First user action
MVP proof
Out-of-scope items
Verification command or browser path
Production gaps
```

This route is documentation. The runnable evidence lives in the real modules listed above.

Archived material:

```text
_archive/merged-out-of-mainline/project-vibe-lab/mobile-app
```

The archived mobile app prototype is not part of the main learning route. Keep it as optional reference material only.
