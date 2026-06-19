# 07 验证记录

## 单元测试

```bash
npm test
```

结果：

```text
✔ marks chat-completions-only providers as short-term with deprecation risk
✔ marks responses-capable providers as better long-term candidates
✔ does not treat plain chat as coding workflow proof
✔ compares Chat Completions and Responses API capability boundaries
✔ lists checks from minimal call to real project workflow
ℹ pass 5
ℹ fail 0
```

## CLI 示例

```bash
npm run assess -- --provider deepseek --chat true --responses false --streaming true --tools false
```

预期：

```text
chat-smoke-only
```

```bash
npm run assess -- --mode compare
```

预期：

```text
chat_completions -> generalApiStatus=supported, codexProviderFit=not-a-codex-provider-proof
responses -> generalApiStatus=recommended-for-new-projects, codexProviderFit=codex-provider-candidate
```

```bash
npm run assess -- --mode checks
```

预期：

```text
包含按当前 Codex 配置参考核对 wire_api
```

## 未验证

- 未调用真实模型。
- 未配置 Codex provider。
- 未验证任何 provider 的长期稳定性。
