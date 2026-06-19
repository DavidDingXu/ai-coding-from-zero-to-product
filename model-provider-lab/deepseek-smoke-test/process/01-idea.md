# 01 原始想法

第 02 篇里要先解决的问题：

```text
国内读者想用 DeepSeek 降低练习成本，但第一步经常卡在 API Key、Base URL、模型名和接口路径。
```

这个模块先不讨论 Codex 完整适配，只验证 DeepSeek 的 OpenAI 兼容 Chat Completions 最小调用链路。

## 第一版范围

- 使用 `https://api.deepseek.com`。
- 调用 `/chat/completions`。
- 默认模型使用 `deepseek-v4-pro`。
- 对旧模型名给出明确提示。
- 支持 dry-run，不需要真实 API Key。

## 不做什么

- 不配置 Codex。
- 不验证 Responses API。
- 不处理流式输出。
- 不把一次 smoke test 写成长期稳定结论。
