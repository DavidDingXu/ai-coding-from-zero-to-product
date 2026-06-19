# 02 需求整理

## 用户故事

作为国内 AI 编程读者，我希望用一个最小命令检查 DeepSeek 或千问的 API 配置是否可用，这样我能在进入 Codex 配置前先排除基础接口问题。

## Provider

第一版支持：

| provider | API Key | Base URL | Model | Wire API |
|---|---|---|---|---|
| DeepSeek | `DEEPSEEK_API_KEY` | `https://api.deepseek.com` | `deepseek-v4-pro` | Chat Completions |
| Qwen / DashScope | `DASHSCOPE_API_KEY` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-plus` | Chat Completions |

## 命令

兼容性矩阵：

```bash
npm run matrix
```

Dry run：

```bash
npm run dry-run:deepseek
npm run dry-run:qwen
```

真实调用：

```bash
npm run smoke:deepseek
npm run smoke:qwen
```

## 输出

矩阵输出：

- provider 默认 Base URL 和模型名。
- 当前 demo 验证的 endpoint。
- 当前 demo 没有验证的 Responses API 和 Codex 工作流边界。
- 最小接口调用、Codex provider 配置、真实项目工作流三层判断。

Dry run 输出：

- provider
- endpoint
- model
- requestApi
- 脱敏后的 API Key
- 请求体

真实调用输出：

- provider
- endpoint
- model
- requestApi
- 模型返回内容
- usage，如果响应中存在

## 错误处理

- provider 不认识：提示未知 provider。
- API Key 缺失：明确提示缺少哪个环境变量。
- HTTP 非 2xx：展示状态码和服务端错误信息。
- 响应没有 `choices[0].message.content`：提示响应形状不符合预期。

## 完成判断

- `npm test` 通过。
- `npm run matrix` 能输出三层兼容性边界。
- `npm run dry-run:deepseek` 能输出请求形状。
- `npm run dry-run:qwen` 能输出请求形状。
- 测试里用本地 HTTP server 模拟 live 请求，证明请求路径、header、body 正确。
