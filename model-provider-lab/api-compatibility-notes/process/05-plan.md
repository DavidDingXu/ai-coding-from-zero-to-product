# 05 实施计划

1. 先写测试，覆盖三类 provider 能力判断。
2. 实现 `compatibility-advisor.js`。
3. 实现 CLI，支持 assess、compare、checks。
4. 补 README 和过程记录。
5. 跑测试和 CLI 示例。

## 完成标准

- `npm test` 通过。
- CLI 能输出 Chat Completions-only provider 的风险判断。
- CLI 能输出 Chat Completions / Responses API 对比。
- README 明确当前模块不调用真实 API。
