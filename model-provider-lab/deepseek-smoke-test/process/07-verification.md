# 07 验证记录

## 单元测试

```bash
npm test
```

结果：

```text
✔ uses current DeepSeek defaults from official API docs
✔ normalizes chat completions endpoint without duplicate slashes
✔ warns for deprecated legacy DeepSeek model names
✔ accepts current DeepSeek V4 models
✔ builds a minimal non-stream chat completions request
ℹ pass 5
ℹ fail 0
```

## Dry Run

```bash
npm run dry-run
```

结果包含：

```json
{
  "mode": "dry-run",
  "endpoint": "https://api.deepseek.com/chat/completions",
  "model": "deepseek-v4-pro",
  "boundary": "dry-run 只验证请求形状，不发真实网络请求，也不证明 Codex 完整适配。"
}
```

## 未验证

- 未执行真实 DeepSeek 调用，因为本仓库不保存真实 API Key。
- 未验证 Responses API。
- 未验证 Codex 自定义 provider 配置。
