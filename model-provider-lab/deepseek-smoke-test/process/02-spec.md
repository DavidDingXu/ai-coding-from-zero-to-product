# 02 需求整理

## 输入

环境变量：

```text
DEEPSEEK_API_KEY
DEEPSEEK_BASE_URL
DEEPSEEK_MODEL
DEEPSEEK_THINKING
DEEPSEEK_REASONING_EFFORT
```

## 输出

Dry run：

```json
{
  "mode": "dry-run",
  "endpoint": "https://api.deepseek.com/chat/completions",
  "model": "deepseek-v4-pro"
}
```

真实调用：

```json
{
  "ok": true,
  "mode": "live",
  "content": "..."
}
```

## 规则

- 默认模型为 `deepseek-v4-pro`。
- `deepseek-chat` 和 `deepseek-reasoner` 标记为旧模型名。
- dry-run 不发请求。
- smoke 调用缺少 API Key 时直接失败。
- HTTP 失败时保留状态码和服务端错误信息。
