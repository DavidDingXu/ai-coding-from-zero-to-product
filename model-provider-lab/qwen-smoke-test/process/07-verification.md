# 07 验证记录

## 单元测试

```bash
npm test
```

结果：

```text
✔ uses DashScope Beijing compatible-mode defaults
✔ falls back to BAILIAN_API_KEY when DASHSCOPE_API_KEY is missing
✔ normalizes chat completions endpoint without duplicate slashes
✔ classifies Beijing, Virginia, Singapore and Frankfurt compatible-mode base URLs
✔ flags legacy Singapore DashScope domain
✔ flags Qwen Code Coding Plan base URL as a different route
✔ builds a minimal non-stream OpenAI-compatible request
ℹ pass 7
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
  "endpoint": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  "model": "qwen-plus",
  "boundary": "dry-run 只验证请求形状，不发真实网络请求，也不证明 Codex 完整适配。"
}
```

## 未验证

- 未执行真实千问调用，因为本仓库不保存真实 API Key。
- 未验证 Responses API。
- 未验证 Qwen Code Coding Plan。
- 未验证 Codex 自定义 provider 配置。
