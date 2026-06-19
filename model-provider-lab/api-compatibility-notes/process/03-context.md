# 03 上下文

关键上下文：

- 第 02 篇讲 OpenAI 兼容边界。
- DeepSeek 模块验证最小 Chat Completions 调用。
- 千问 / DashScope 模块验证最小 Chat Completions 调用。
- Codex 自定义 provider 的 `wire_api` 支持范围必须以当前官方配置参考为准。
- Chat Completions smoke test 只证明普通接口可用，不能当作 Codex provider 适配证明。
- Codex 的 `model_verbosity` 等配置只适用于 Responses API provider。
- OpenAI API 文档里 Chat Completions 仍然支持，但新项目推荐 Responses API。
- 阿里云百炼文档把 Chat Completions 和 Responses 分成不同接口说明，项目不能把两者混成一个能力。

文章必须把这些事实写成读者能理解的工程判断。
