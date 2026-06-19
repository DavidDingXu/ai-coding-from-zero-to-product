# 06 实现记录

## 第一轮

先写测试：

- Chat Completions-only provider 标记为短期试验和高长期风险。
- Responses-capable provider 标记为长期候选。
- 普通聊天不能证明 AI 编程工作流稳定。
- 对比 Chat Completions 与 Responses API。
- 列出从最小调用到真实项目验证的检查清单。

第一次运行测试失败，原因是 `src/compatibility-advisor.js` 不存在。

## 第二轮

实现：

- `assessProviderCompatibility`
- `compareWireApis`
- `listCompatibilityChecks`

## 第三轮

补充：

- `src/cli.js`
- `README.md`
- `process/` 记录

## 第四轮

按当前主线和官方资料修正：

- 增加 `generalApiStatus`，区分普通 API 层面和 Codex provider 层面。
- 将 Chat Completions 的结论改为：普通接口可做 smoke test，但不能当作 Codex provider 适配证明。
- 在检查清单中加入“按当前 Codex 配置参考核对 wire_api”。
- README 和过程记录从历史独立文章口径迁移到第 02 篇和附录证据库。
