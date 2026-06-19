# 06 实现记录

## 第一轮

先写测试：

- 默认北京地域兼容模式。
- `BAILIAN_API_KEY` 兜底。
- endpoint 拼接。
- 北京地域地址分类。
- Coding Plan 地址提示。
- 最小请求体。

第一次运行测试失败，原因是 `src/qwen-config.js` 不存在。

## 第二轮

实现：

- `getQwenConfig`
- `normalizeQwenEndpoint`
- `classifyQwenBaseUrl`
- `buildQwenRequest`
- `maskSecret`

## 第三轮

补充：

- `runQwenSmokeTest`
- `src/cli.js`
- `README.md`
- `process/` 记录

## 第四轮

按专栏定位收窄为国内读者默认路线：

- 主线只保留百炼北京地域地址。
- 其他地域不作为本专栏学习项。
- 新增 `.env.example`，避免读者把真实 Key 写进 README 或正文。
