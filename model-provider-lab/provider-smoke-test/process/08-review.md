# 08 复盘

## 做对的地方

第一，先把“能不能用”拆成了更小的问题。

不是直接问“Codex 能不能接 DeepSeek / 千问”，而是先问：

```text
这个 provider 的 API Key、Base URL、模型名和 Chat Completions 请求形状能不能跑通？
```

这个问题可以被代码验证。

第二，没有把 smoke test 的结论扩大。

模块明确说明：它只验证普通 Chat Completions 最小请求，不验证 Responses API、流式输出、工具调用、Codex provider 和长任务稳定性。

第三，增加了兼容性矩阵。

读者可以先看到三层边界：最小接口调用、Codex provider 配置、真实项目工作流。这样 dry-run 通过后，不会误以为已经完成了 Codex 长期稳定适配。

第四，测试不依赖真实外网。

live 请求逻辑用本地 HTTP server 验证，这样没有 API Key 的读者也能确认代码行为。

## 后续可以继续补什么

- Responses API 探测。
- 流式输出探测。
- 错误码分类。
- Codex `config.toml` provider 配置示例。
- 兼容网关示例。

## 文章里要避免的说法

不要写：

```text
DeepSeek / 千问的 OpenAI 兼容接口能跑通，只能证明普通 Chat Completions 最小调用可用，不能直接推导 Codex 可以长期稳定使用。
```

应该写：

```text
这个 smoke test 只能证明最小 Chat Completions 请求可以按 OpenAI 兼容形状发出。
Codex 的完整工作流还涉及 Responses API、流式输出、工具调用、上下文和长任务稳定性，需要继续验证。
```
