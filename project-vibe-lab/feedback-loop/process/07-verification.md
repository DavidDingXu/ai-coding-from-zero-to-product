# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run inbox
npm run classify
npm run extract
npm run spec
npm run tasks
npm run audit
npm run checklist
npm run prompt
```

预期：

- `npm test`：10 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-next-iteration`。
- `npm run spec`：输出包含问题、范围、非目标和可验证条件的 spec。
- `npm run tasks`：输出下一轮小任务和验证方式。
