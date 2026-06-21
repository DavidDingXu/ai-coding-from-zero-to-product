# AI Coding From Zero To Product

## Scope

This repository is the runnable companion project for the course. Keep it usable as a standalone Git repository.

## Repository Rules

- Do not commit real API keys, tokens, cookies, or local machine paths.
- Keep examples runnable for beginners: include clear commands, expected output, and common failure notes.
- Every runnable module should include `README.md`, `.env.example` when configuration is needed, and a focused verification command.
- Mainline learning modules should give beginners a visible first result before asking them to run tests: a page, popup, checklist, dry-run report, matrix, or user path.
- `npm run verify` is an author/advanced-reader evidence gate. It must not replace the beginner path of opening the visible result and trying one small change.
- Keep process notes in `process/` so readers can see the idea, spec, prompts, plan, implementation log, verification, and review.
- For product-practice modules, treat `process/` as the main teaching artifact: record the real requirement development path, not just the commands that prove the result runs.
- Product-practice requirements must feel like real cases: name the user, scenario, constraints, scope cuts, and next feedback loop. Sanitized or teaching-shaped cases are fine; fake requirements created only to demo CLI output are not.
- Do not present a module as product practice if it only runs a JS/TS CLI and prints output. That is tool verification. Product practice must show the requirement, scope cuts, AI task handoff, implementation decisions, verification evidence, review, and next iteration.
- Prefer small, readable implementations over framework-heavy demos.
- If a feature is only planned, say so in the README instead of presenting it as finished.

## Verification

- Run the module's local test command before claiming it works.
- For JavaScript modules, start with `npm test` unless the module README says otherwise.
- For browser demos, verify the page opens and record the local URL or screenshot note in `process/07-verification.md`.

## Writing For Readers

- Explain paths relative to this repository root.
- Use beginner-friendly wording before adding implementation detail.
- Avoid referring to private author workspaces, publishing schedules, or article draft directories.
