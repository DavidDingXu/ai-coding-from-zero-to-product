# DeepSeek Smoke Test

这个模块作为第 02 篇和附录里的 DeepSeek 可用性证据库保留。

它验证的是 DeepSeek OpenAI 兼容 Chat Completions 的最小调用链路：

```text
环境变量 -> Base URL -> /chat/completions -> 模型名 -> messages -> 响应内容
```

它不证明 Codex 已经长期稳定适配 DeepSeek，也不验证 Responses API。

## 默认跟练配置

根据 DeepSeek 官方 API 文档：

```text
Base URL: https://api.deepseek.com
Endpoint: /chat/completions
默认模型: deepseek-v4-pro
```

本模块会提示旧模型名风险：

```text
deepseek-chat
deepseek-reasoner
```

DeepSeek 官方文档标注这两个旧模型名将在 `2026/07/24 15:59 UTC` 废弃。新练习不要再把它们写成默认值。

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

期望看到 5 条测试通过。

## 环境变量

可以参考 `.env.example`：

```text
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_THINKING=enabled
DEEPSEEK_REASONING_EFFORT=medium
```

真实 API Key 不要写进 `.env.example`，也不要提交到 Git。

## Dry Run

Dry run 不发真实网络请求，只检查请求形状。

```bash
npm run dry-run
```

你应该看到：

```json
{
  "mode": "dry-run",
  "provider": "deepseek",
  "endpoint": "https://api.deepseek.com/chat/completions",
  "model": "deepseek-v4-pro"
}
```

## 真实调用

配置 API Key：

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

可选配置：

```bash
export DEEPSEEK_BASE_URL="https://api.deepseek.com"
export DEEPSEEK_MODEL="deepseek-v4-pro"
export DEEPSEEK_THINKING="enabled"
export DEEPSEEK_REASONING_EFFORT="medium"
```

运行：

```bash
npm run smoke
```

成功时会看到：

```json
{
  "ok": true,
  "mode": "live",
  "provider": "deepseek",
  "model": "deepseek-v4-pro"
}
```

## 常见错误

缺少 API Key：

```text
缺少 DEEPSEEK_API_KEY
```

旧模型名：

```text
deepseek-chat 属于旧模型名，DeepSeek 官方文档标注将在 2026/07/24 15:59 UTC 废弃
```

网络或账号问题：

```text
HTTP 401 / 403 / 429 / 5xx
```

这类错误要分别检查 API Key、账号权限、额度、频率限制和服务状态，不要直接归因成“模型不可用”。

## 边界

- 本模块只覆盖 DeepSeek Chat Completions 最小调用。
- 本模块不验证 Responses API。
- 本模块不自动写 Codex 配置。
- 本模块不把 `OpenAI 兼容` 写成 `Codex 长期稳定可用`。
