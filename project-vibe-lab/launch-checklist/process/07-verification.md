# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run gates
npm run audit
npm run release
npm run rollback
npm run evidence
npm run prompt
```

预期：

- `npm test`：9 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-small-release`。
- `npm run rollback`：输出触发条件、动作和回滚证据。
