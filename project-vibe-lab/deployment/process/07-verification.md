# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run platforms
npm run choose
npm run runbook
npm run commands
npm run audit
npm run evidence
npm run smoke
npm run rollback
npm run prompt
```

预期：

- `npm test`：13 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-small-release`。
- `npm run runbook`：输出 preview、health、smoke、rollback 步骤。
- `npm run commands`：输出平台命令和人工确认点。
