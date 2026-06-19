# 07 验证记录

## 单元测试

命令：

```bash
npm test
```

结果：

```text
✔ getProviderConfig returns current DeepSeek defaults
✔ getProviderConfig returns DashScope compatible-mode defaults for Qwen
✔ normalizeChatCompletionsUrl appends chat endpoint without double slashes
✔ buildChatCompletionRequest creates a minimal OpenAI-compatible request
✔ maskSecret keeps enough information for debugging without leaking the key
✔ listProviderCompatibility explains the three verification layers
✔ runSmokeTest returns a dry-run report without calling the network
✔ runSmokeTest fails early when API key is missing
✔ runSmokeTest sends a real chat-completions request to the configured endpoint
ℹ pass 9
ℹ fail 0
```

## 兼容性矩阵

命令：

```bash
npm run matrix
```

关键输出：

```json
{
  "providers": [
    {
      "provider": "deepseek",
      "verifiedEndpoint": "/chat/completions",
      "requestApi": "chat_completions"
    }
  ],
  "layers": [
    {
      "id": "minimal-chat-call"
    },
    {
      "id": "codex-provider"
    },
    {
      "id": "project-workflow"
    }
  ]
}
```

## DeepSeek dry-run

命令：

```bash
npm run dry-run:deepseek
```

关键输出：

```json
{
  "ok": true,
  "mode": "dry-run",
  "provider": "deepseek",
  "endpoint": "https://api.deepseek.com/chat/completions",
  "model": "deepseek-v4-pro",
  "requestApi": "chat_completions"
}
```

## Qwen dry-run

命令：

```bash
npm run dry-run:qwen
```

关键输出：

```json
{
  "ok": true,
  "mode": "dry-run",
  "provider": "qwen",
  "endpoint": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  "model": "qwen-plus",
  "requestApi": "chat_completions"
}
```

## 没有验证的内容

当前没有使用真实 API Key 调用 DeepSeek 或 DashScope。

原因：仓库不能包含真实密钥，自动验证也不应该依赖个人账号余额和外部网络。

读者配置自己的 API Key 后，可以运行：

```bash
npm run smoke:deepseek
npm run smoke:qwen
```

## 结论

当前模块已经验证：

- 请求形状正确。
- dry-run 可用。
- 兼容性矩阵能明确三层验证边界。
- 缺 key 能提前失败。
- live 请求逻辑可通过本地 HTTP server 验证。

它还没有验证真实 provider 的服务端可用性，也没有验证 Codex 对这些模型的完整适配。
