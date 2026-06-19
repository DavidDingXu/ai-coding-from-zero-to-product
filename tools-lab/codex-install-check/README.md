# AI Coding Workbench Check

这个模块用于检查本机是否具备跟练《从想法到产品：普通人的 AI 编程实战》的基础环境。

它不是 Codex 或 Claude Code 官方诊断工具的替代品。它先检查最容易卡住的几项：Node.js、npm、Codex CLI、Codex 配置目录、登录缓存、全局 AGENTS.md、项目 AGENTS.md。Claude Code CLI 只作为可选对照项提示，不影响这条主线继续学习。

## 先看过程

```text
process/01-idea.md
process/02-spec.md
process/03-context.md
process/04-prompts.md
process/05-plan.md
process/06-implementation-log.md
process/07-verification.md
process/08-review.md
```

## 运行测试

```bash
npm test
```

## 运行自检

```bash
npm run check
```

如果想要 JSON 输出：

```bash
npm run check:json
```

## 当前检查项

- Node.js
- npm
- Codex CLI
- Claude Code CLI（可选）
- `~/.codex/config.toml`
- `~/.codex/auth.json`
- `~/.codex/AGENTS.md`
- 当前项目或上级目录中的 `AGENTS.md`
- 当前项目或上级目录中的 `CLAUDE.md`

## 边界

- 这个工具不读取你的密钥内容。
- 这个工具不验证模型额度。
- 这个工具不代替 `codex doctor`。
- 这个工具不代替 `claude doctor`。
- 如果 Codex 使用系统凭据存储，缺少 `auth.json` 不一定代表登录失败。
- 如果你暂时只使用 Codex，缺少 Claude Code CLI 和 `CLAUDE.md` 不影响继续学习。
