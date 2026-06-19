# Appendix Resources

This document replaces the old appendix npm package. Appendix lessons are reference material, so they should stay as readable tables and checklists.

## Tool Table

| Task | Prefer |
|---|---|
| Beginner first product | Codex App |
| Familiar terminal workflow | Codex CLI / Claude Code |
| Current file edit | Cursor |
| Page interaction verification | Codex Browser / Chrome |
| Repeatable local checks | Claude Code / Codex CLI |
| Open terminal-agent route | OpenCode |
| Google model route or extra long-context review | Gemini CLI |

## Error Triage

| Error Type | First Check |
|---|---|
| Port occupied | Which process owns the port; whether another dev server is running |
| Page blank | Browser console, network tab, built files, root element |
| npm install fails | Node/npm version, lockfile, registry, network, package name |
| API key fails | `.env`, server-side loading, base URL, model name, endpoint |
| Provider compatibility | Minimal chat, API layer, Codex provider, real repo workflow |
| Deploy fails | Build command, env vars, runtime logs, rollback path |

## Prompt Templates

### Clarify Requirements

```text
Please read README.md and process/02-spec.md first.
Before changing files, restate the target user, MVP scope, out-of-scope items, and verification command.
Ask only for missing information that blocks the task.
```

### Small Implementation

```text
Only handle <task-id>.
Read the relevant source file and test first.
Make the smallest change that satisfies the spec.
Run <verification-command>.
Report changed files and uncovered paths.
```

### Debugging

```text
First reproduce the failure.
Do not change code until expected behavior, actual behavior, and likely layer are identified.
Use the failure output as evidence.
After the fix, rerun the original failing command.
```

### Review

```text
Review the diff against the task spec.
Prioritize correctness, security, data/privacy, missing tests, and user-visible regressions.
List findings with file references and concrete fixes.
```

## Idea Selection

Pick ideas that satisfy:

```text
You would use it yourself
The first version does not require complex accounts
Input and output can be simulated locally
You can demo it in one week
You can find 3-5 real users for feedback
```

## Glossary

| Term | Meaning In This Course |
|---|---|
| API | Contract between frontend, backend, model, or external service |
| `.env` | Local secrets and environment-specific config; never commit real keys |
| Token | Model usage unit and cost driver |
| Prompt | Task instruction plus context, boundary, and verification request |
| Spec | Written task contract: scope, out-of-scope, inputs, outputs, checks |
| Diff | Actual code/document change to review |
| Smoke Test | Small test proving the basic path works, not full correctness |
| LocalStorage | Browser-side local storage; useful for demos, not a production database |
| MVP | The smallest version that proves one user path |
| Evidence Gate | A checklist that decides whether a task is ready to continue |

## Next Routes

```text
Personal product route: one product, one MVP, one feedback loop.
Local trial route: one demo, one small group of users, one feedback cycle.
Production upgrade route: auth, storage, privacy, cost, deploy, payment, and rollback.
```
