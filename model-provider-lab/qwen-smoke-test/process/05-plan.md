# 05 实施计划

1. 先写测试，固定默认配置、endpoint、Base URL 分类、旧域名阻断和请求体。
2. 实现 `qwen-config.js`。
3. 实现 `smoke-runner.js`。
4. 实现 CLI。
5. 补 README 和过程记录。
6. 跑测试和 dry-run。

## 完成标准

- `npm test` 通过。
- `npm run dry-run` 通过。
- README 清楚区分百炼兼容模式和 Qwen Code Coding Plan。
- 不泄露 API Key。
