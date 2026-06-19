# 05 实现计划

## 计划

1. 写 provider 配置测试。
2. 写 smoke runner 测试。
3. 确认测试因缺少实现失败。
4. 实现 `provider-config.js`。
5. 实现 `smoke-runner.js`。
6. 实现 CLI。
7. 写 README。
8. 增加兼容性矩阵命令，明确 smoke test 能证明什么、不能证明什么。
9. 跑 `npm test`。
10. 跑 `npm run matrix`。
11. 跑两个 dry-run 命令。

## 文件职责

```text
src/provider-config.js   # provider 默认配置、endpoint 归一化、请求体构造
src/smoke-runner.js      # dry-run/live 执行逻辑
src/cli.js               # 命令行入口
test/*.test.js           # 配置、请求和 runner 行为测试
README.md                # 读者运行说明和边界说明
.env.example             # 环境变量示例，不包含真实 key
```

## 关键取舍

不使用 OpenAI SDK。

原因：这一讲要讲清接口形状，直接构造 HTTP 请求更透明。读者能看到 base URL 最终如何变成 `/chat/completions`，也能看到请求体里到底传了什么。

不读取 `.env` 文件。

原因：不引入 dotenv，保持零依赖。读者可以用 `export` 配置环境变量，后续完整项目再引入更舒服的配置方式。

## 风险点

- 把 Chat Completions smoke test 写成 Codex 完整适配证明。
- 把 API Key 打印到终端。
- live 测试依赖真实外网，导致无 key 或网络受限时无法验证代码。

## 对应处理

- README 明确写边界。
- 矩阵命令把最小接口调用、Codex provider 配置、真实项目工作流分开。
- 输出 API Key 时只展示脱敏值。
- 测试里用本地 HTTP server 模拟 live 请求。
