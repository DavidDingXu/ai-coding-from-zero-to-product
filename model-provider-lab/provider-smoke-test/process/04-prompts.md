# 04 关键提示词

## 创建 smoke test 模块

```text
请在 model-provider-lab/provider-smoke-test 下创建一个零第三方依赖的 Node.js smoke test 工具。

目标：
验证 DeepSeek 和千问 / DashScope 的 OpenAI 兼容 Chat Completions 请求形状。

要求：
1. 支持 deepseek 和 qwen 两个 provider。
2. 支持 dry-run，不发真实网络请求，只输出 endpoint、model、requestApi 和请求体。
3. 支持 live 请求，调用 /chat/completions。
4. 缺少 API Key 时要提前失败，并明确提示缺少哪个环境变量。
5. 用 node:test 写测试。
6. live 测试使用本地 HTTP server 模拟，不依赖真实外网。
7. README 里必须说明这个模块不能证明 Codex 长期稳定适配国内模型。

先写失败测试，再写实现。
```

## 为什么这样写

这段提示词强调的是“判断边界”，不是只生成代码。

国内模型章节最容易写飘：

```text
DeepSeek / 千问的 OpenAI 兼容接口能跑通，只能证明普通 Chat Completions 最小调用可用，不能直接推导 Codex 可以长期稳定使用。
```

这个说法不严谨。

更好的做法是让代码先证明最小请求能不能跑，再在文章里说明边界。

## 后续可扩展提示词

```text
请在当前模块基础上增加 Responses API 探测。

要求：
1. 不要改掉现有 Chat Completions smoke test。
2. 新增 responses dry-run。
3. 如果 provider 没有明确支持 Responses API，默认只输出配置建议和风险提示，不发请求。
4. 补测试，证明 Chat Completions 和 Responses API 的边界不会混淆。
```
