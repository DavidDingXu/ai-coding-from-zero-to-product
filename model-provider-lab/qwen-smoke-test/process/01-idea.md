# 01 原始想法

第 02 篇里要补充判断的问题：

```text
国内读者想用千问，但容易把百炼 OpenAI 兼容模式、Qwen Code Coding Plan 和模型名混在一起。
```

这个模块先做一件小事：验证百炼 / DashScope OpenAI 兼容模式的最小 Chat Completions 请求形状。

## 第一版范围

- 默认 Base URL 使用北京地域 `https://dashscope.aliyuncs.com/compatible-mode/v1`。
- 默认模型使用 `qwen-plus`。
- 支持 `DASHSCOPE_API_KEY`，也兼容 `BAILIAN_API_KEY`。
- 能提示 Qwen Code Coding Plan 是另一条路线。

## 不做什么

- 不验证 Qwen Code Coding Plan。
- 不配置 Codex。
- 不验证 Responses API。
- 不处理流式输出。
