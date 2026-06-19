# API Compatibility Notes

这个模块作为第 02 篇和附录里的接口兼容边界证据库保留。

它不调用真实模型，只做一件事：把 provider 能力边界整理成可运行、可测试的判断规则。

## 核心边界

- 普通 OpenAI API 层面：Chat Completions 仍然支持，但新项目更推荐 Responses API。
- Codex provider 层面：Codex 官方配置参考里，`model_verbosity` 只适用于 Responses API provider；Chat Completions smoke test 不能当作 Codex provider 适配证明。
- 百炼 / DashScope 层面：阿里云百炼把 Chat Completions 和 Responses 分成不同接口说明；支持某个接口不等于完整 Codex 工作流稳定。

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

## 评估一个 Chat Completions 接口路线

```bash
npm run assess -- --provider deepseek --chat true --responses false --streaming true --tools false
```

预期结果：

```json
{
  "level": "chat-smoke-only",
  "longTermRisk": "high",
  "canProveCodexStable": false
}
```

## 对比 Chat Completions 和 Responses API

```bash
npm run assess -- --mode compare
```

预期能看到：

```json
[
  {
    "api": "chat_completions",
    "generalApiStatus": "supported",
    "codexProviderFit": "not-a-codex-provider-proof"
  },
  {
    "api": "responses",
    "generalApiStatus": "recommended-for-new-projects",
    "codexProviderFit": "codex-provider-candidate"
  }
]
```

## 输出验证阶梯

```bash
npm run assess -- --mode checks
```

预期包含：

```text
最小 Chat Completions 调用
Responses API 支持
按当前 Codex 配置参考核对 wire_api
流式输出
工具调用或等价机制
长上下文与上下文压缩
真实项目改代码、跑测试、浏览器验证
```

## 使用边界

- 本模块不验证任何 provider 的真实 API。
- 本模块不证明 Codex 完整适配某个国内模型。
- 本模块只把“聊天可用”和“AI 编程工作流稳定”之间的差异做成可测试判断。
- 真实项目稳定性必须回到 Codex provider 配置、长任务、工具调用、命令验证和浏览器验证。
