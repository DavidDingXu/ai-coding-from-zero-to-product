# 02 需求整理

## 输入

```json
{
  "provider": "deepseek",
  "supportsChatCompletions": true,
  "supportsResponsesApi": false,
  "supportsStreaming": true,
  "supportsToolCalling": false
}
```

## 输出

```json
{
  "level": "chat-smoke-only",
  "longTermRisk": "high",
  "canProveCodexStable": false
}
```

## 判断规则

- 只有 Chat Completions：只能证明聊天或最小调用，不能证明 Codex 稳定。
- Chat Completions + streaming：可以做普通接口练习；不能当作 Codex provider 适配证明。
- Responses API + streaming + tool calling：更适合长期候选，但仍需真实项目验证。
- 任何一次判断都不能把 provider 直接写成“已稳定适配 Codex”。
