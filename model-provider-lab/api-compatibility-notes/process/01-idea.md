# 01 原始想法

第 02 篇和附录里要解释的问题：

```text
DeepSeek、千问的 Chat Completions smoke test 可以先证明普通接口能跑通，但这不能证明它们能稳定支撑 Codex 写代码。
```

读者容易把“能聊天”理解成“能做 AI 编程”。这个模块把差异拆成几个检查点。

## 第一版范围

- 判断 Chat Completions-only provider 的短期价值和长期风险。
- 判断 Responses API provider 是否更适合作为长期候选。
- 区分普通 API 层面的 Chat Completions 可用于 smoke test，和 Codex provider 层面必须按当前官方配置参考核对 `wire_api`。
- 列出从最小调用到真实项目工作流的验证阶梯。

## 不做什么

- 不调用真实 API。
- 不配置 Codex。
- 不替任何 provider 做稳定性背书。
