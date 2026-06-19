# 04 关键提示词

## 生成模块

```text
请实现一个 api-compatibility-notes 模块。
目标不是调用真实 API，而是把 Chat Completions、Responses API、streaming、tool calling、真实项目验证之间的关系做成可测试判断。
要求：
1. Chat Completions-only 不能证明 Codex 稳定。
2. Chat Completions + streaming 只能作为普通接口练习；不能写成 Codex provider 可用。
3. Responses API + streaming + tool calling 是长期候选，但仍不能直接证明稳定。
4. 输出从最小调用到真实项目验证的检查清单，并包含按当前 Codex 配置参考核对 wire_api 这一层。
```

## 写文章时的提示词

```text
请解释为什么“能聊天”不等于“能稳定写代码”。
用 DeepSeek 和千问 smoke test 作为前置例子。
重点讲 Chat Completions 和 Responses API 的边界，以及 Codex 为什么需要进一步验证真实项目工作流。
不要把国内模型写成不可用，也不要把一次调用成功写成长期稳定。
```
