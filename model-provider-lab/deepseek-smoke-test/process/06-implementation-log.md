# 06 实现记录

## 第一轮

先写测试：

- 默认 Base URL 和模型名。
- `/chat/completions` endpoint 拼接。
- 旧模型名提示。
- 当前 V4 模型名通过。
- 最小 Chat Completions 请求体。

第一次运行测试失败，原因是 `src/deepseek-config.js` 不存在。

## 第二轮

实现：

- `getDeepSeekConfig`
- `normalizeDeepSeekEndpoint`
- `validateDeepSeekModel`
- `buildDeepSeekRequest`
- `maskSecret`

## 第三轮

补充：

- `runDeepSeekSmokeTest`
- `src/cli.js`
- `README.md`
- `process/` 记录
