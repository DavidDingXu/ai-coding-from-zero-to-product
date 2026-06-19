# Provider Smoke Test

这个模块用于验证 DeepSeek、千问 / DashScope 这类国内模型的 OpenAI 兼容调用是否至少能跑通一次最小请求。

它不是 Codex 的完整适配证明。它只验证一件事：当前 API Key、Base URL、模型名和 Chat Completions 请求形状是否可用。

## 先看过程

后续文章会围绕这条过程展开：

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

## 兼容性矩阵

先看这个模块到底验证了什么、没验证什么：

```bash
npm run matrix
```

你会看到三层判断：

```text
最小 Chat Completions 调用
Codex provider 配置
真实项目工作流
```

本模块只覆盖第一层。后两层需要放到 Codex 配置和真实项目里继续验证。

## Dry Run

Dry run 不发真实网络请求，只检查 provider、endpoint、model 和请求体。

```bash
npm run dry-run:deepseek
npm run dry-run:qwen
```

## 真实调用

先配置环境变量。

DeepSeek：

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
export DEEPSEEK_BASE_URL="https://api.deepseek.com"
export DEEPSEEK_MODEL="deepseek-v4-pro"
npm run smoke:deepseek
```

千问 / DashScope：

```bash
export DASHSCOPE_API_KEY="你的百炼 API Key"
export DASHSCOPE_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
export DASHSCOPE_MODEL="qwen-plus"
npm run smoke:qwen
```

## 结果怎么看

成功时会看到：

```json
{
  "ok": true,
  "mode": "live",
  "provider": "deepseek",
  "requestApi": "chat_completions",
  "content": "provider smoke test ok"
}
```

如果缺少 API Key，会直接提示缺少哪个环境变量。

## 边界

- 这个模块使用 OpenAI 兼容的 `/chat/completions`。
- 它不验证 Responses API。
- 它不证明 Codex 长期稳定适配某个国内模型。
- 它适合做入门阶段的模型可用性检查。
- DashScope 官方文档有 OpenAI 兼容模式和 Responses API 相关说明，但本模块不调用 Responses API。
- Codex 自定义 provider 请按当前官方配置参考重新核对，尤其是 `wire_api` 支持范围；本模块的 Chat Completions smoke test 只作为普通接口练习，不能作为 Codex provider 方案依据。
