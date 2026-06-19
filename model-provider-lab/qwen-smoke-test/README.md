# Qwen / DashScope Smoke Test

这个模块作为第 02 篇和附录里的千问 / DashScope 可用性证据库保留。

它验证的是阿里云百炼 / DashScope OpenAI 兼容模式的最小 Chat Completions 调用链路：

```text
API Key -> Base URL -> /chat/completions -> model -> messages -> choices[0].message.content
```

它不验证 Codex 完整适配，不验证 Responses API，也不验证 Qwen Code Coding Plan。

## 默认跟练配置

```text
Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
Endpoint: /chat/completions
默认模型: qwen-plus
```

本专栏只保留国内读者最直接的百炼北京地域路线。其他地域不进入主线；确实需要时，回到阿里云百炼官方文档确认 Base URL、Workspace、模型名和计费规则。

Qwen Code Coding Plan 常见地址：

```text
https://coding.dashscope.aliyuncs.com/v1
```

Coding Plan 是另一条路线，不是本模块默认的百炼 OpenAI 兼容模式。

## 环境变量

先复制示例文件，再填入自己的 Key：

```bash
cp .env.example .env
```

推荐使用：

```text
DASHSCOPE_API_KEY
DASHSCOPE_BASE_URL
DASHSCOPE_MODEL
DASHSCOPE_ENABLE_THINKING
```

模块也兼容旧项目里常见的：

```text
BAILIAN_API_KEY
BAILIAN_BASE_URL
BAILIAN_MODEL
```

真实 Key 不要提交到 Git，不要贴进文章截图，也不要发给 AI。

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

期望看到 6 条测试通过。

## Dry Run

Dry run 不发真实网络请求，只检查请求形状。

```bash
npm run dry-run
```

你应该看到：

```json
{
  "mode": "dry-run",
  "provider": "qwen",
  "endpoint": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  "model": "qwen-plus"
}
```

## 真实调用

配置 API Key：

```bash
export DASHSCOPE_API_KEY="你的百炼 API Key"
```

可选配置：

```bash
export DASHSCOPE_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
export DASHSCOPE_MODEL="qwen-plus"
export DASHSCOPE_ENABLE_THINKING="true"
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
  "provider": "qwen",
  "model": "qwen-plus"
}
```

## 常见错误

缺少 API Key：

```text
缺少 DASHSCOPE_API_KEY 或 BAILIAN_API_KEY
```

把 Coding Plan 地址用于本模块：

```text
这是 Qwen Code Coding Plan 路线的地址，不是本模块默认的百炼按量付费 OpenAI 兼容模式
```

HTTP 401 / 403 / 429 / 5xx：

分别检查 API Key、账号权限、模型权限、额度、频率限制和服务端状态。

## 边界

- 本模块只覆盖百炼 / DashScope OpenAI 兼容模式下的 Chat Completions。
- 本模块不验证 Responses API。
- 本模块不验证 Qwen Code Coding Plan。
- 本模块不自动写 Codex provider 配置。
- 本模块不把一次 smoke test 写成 Codex 长期稳定适配。
