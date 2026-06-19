# 01 原始想法

## 一句话

做一个国内模型 provider smoke test，帮助读者判断 DeepSeek、千问 / DashScope 的 OpenAI 兼容接口是否至少能跑通一次最小调用。

## 为什么需要这个模块

国内读者学 AI 编程，常见问题不是“模型概念不懂”，而是第一步就卡在：

- API Key 配在哪里。
- Base URL 写哪个。
- 模型名写哪个。
- OpenAI 兼容到底兼容到什么程度。
- 能聊天是否等于能稳定配合 Codex 写代码。

如果没有一个最小验证工具，读者只能照抄配置。配置一旦失败，就很难判断问题在账号、网络、模型名、接口协议还是本地工具。

## 第一版只验证什么

- DeepSeek 默认 base URL、模型名和 `/chat/completions` 请求形状。
- 千问 / DashScope compatible mode 默认 base URL、模型名和 `/chat/completions` 请求形状。
- dry-run 模式能在没有 API Key 时展示请求形状。
- live 模式能发出一次真实 OpenAI 兼容 Chat Completions 请求。

## 第一版不验证什么

- 不验证 Responses API。
- 不验证 Codex 完整长任务适配。
- 不验证流式输出。
- 不验证工具调用协议。
- 不验证上下文压缩和长时间 Agent 工作流。

## 关键判断

这个模块只能证明“接口最小调用可用”，不能证明“Codex 长期稳定可用”。

这条边界必须在文章里讲清楚。
