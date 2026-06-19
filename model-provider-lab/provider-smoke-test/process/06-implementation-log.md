# 06 实现记录

## 第 1 轮：先写测试

先写两个测试文件：

```text
test/provider-config.test.js
test/smoke-runner.test.js
```

覆盖内容：

- DeepSeek 默认配置。
- Qwen / DashScope 默认配置。
- base URL 到 `/chat/completions` 的归一化。
- 最小 Chat Completions 请求体。
- API Key 脱敏。
- dry-run 不发网络请求。
- 缺少 API Key 提前失败。
- live 请求能发送到本地 HTTP server。

第一次运行测试失败，错误是模块不存在：

```text
ERR_MODULE_NOT_FOUND
```

这是预期红灯。

## 第 2 轮：实现 provider 配置

创建 `src/provider-config.js`。

关键默认值：

```text
DeepSeek base URL: https://api.deepseek.com
DeepSeek model: deepseek-v4-pro
DashScope base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
DashScope model: qwen-plus
```

请求路径统一拼成：

```text
{baseUrl}/chat/completions
```

## 第 3 轮：实现 runner

创建 `src/smoke-runner.js`。

dry-run 直接返回请求形状，不调用网络。

live 模式：

- 先检查 API Key。
- 发 POST 请求。
- 解析 JSON 响应。
- 读取 `choices[0].message.content`。
- HTTP 错误时展示服务端错误信息。

## 第 4 轮：实现 CLI

创建 `src/cli.js`。

支持：

```bash
node src/cli.js deepseek --dry-run
node src/cli.js qwen --dry-run
node src/cli.js deepseek
node src/cli.js qwen
```

## 第 5 轮：验证

运行：

```bash
npm test
npm run dry-run:deepseek
npm run dry-run:qwen
```

三条命令均通过。
