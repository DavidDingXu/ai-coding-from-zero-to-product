# 03 给 AI 的上下文

## 任务背景

这个模块服务第 02 篇和附录，用来解释 Codex、DeepSeek、千问和 OpenAI 兼容接口之间的关系。

目标不是写一个完整 SDK，而是让读者能执行最小验证。

## 工程约束

- 使用 Node 原生能力。
- 不引入第三方 SDK。
- 不引入 dotenv，避免第一版增加依赖。
- 请求使用 `fetch`。
- 测试使用 Node 内置 `node:test`。
- live 测试不能依赖真实外网或真实 API Key，使用本地 HTTP server 模拟。

## 文章边界

文章里不能把 smoke test 写成“Codex 已经完整支持国内模型”。

正确说法：

```text
这个 smoke test 能证明 Chat Completions 兼容接口的最小请求可以跑通。
它不能证明 Codex 的 Responses API、流式输出、工具调用、上下文压缩和长任务协作都稳定可用。
```

## 需要引用的事实

- Codex 自定义 provider 的 `wire_api` 支持范围必须以当前官方配置参考为准。
- 本模块只验证普通 Chat Completions 请求，不把它写成 Codex provider 可用证明。
- DeepSeek 和 DashScope 都提供 OpenAI 兼容接口。

这些事实写公开内容前必须回到官方文档或本地手册，不凭记忆。
