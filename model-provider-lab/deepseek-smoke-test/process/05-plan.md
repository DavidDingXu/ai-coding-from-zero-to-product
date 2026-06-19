# 05 实施计划

1. 先写测试，固定 DeepSeek 默认配置、endpoint、模型名校验和请求体。
2. 实现 `deepseek-config.js`。
3. 实现 `smoke-runner.js`，支持 dry-run 和真实调用。
4. 实现 CLI。
5. 补 `.env.example`、README 和过程记录。
6. 跑测试和 dry-run。

## 完成标准

- `npm test` 通过。
- `npm run dry-run` 通过。
- README 给出真实调用方式和边界。
- `.env.example` 存在但不包含真实 key。
- 不泄露 API Key。
