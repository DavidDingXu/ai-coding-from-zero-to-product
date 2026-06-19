# 02 需求整理

## 输入

环境变量：

```text
DASHSCOPE_API_KEY
BAILIAN_API_KEY
DASHSCOPE_BASE_URL
BAILIAN_BASE_URL
DASHSCOPE_MODEL
BAILIAN_MODEL
DASHSCOPE_ENABLE_THINKING
```

## 输出

Dry run：

```json
{
  "mode": "dry-run",
  "endpoint": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  "model": "qwen-plus"
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

- 默认走北京地域百炼兼容模式。
- Qwen Code Coding Plan 地址要提示为不同路线。
- dry-run 不发请求。
- smoke 调用缺少 API Key 时直接失败。
