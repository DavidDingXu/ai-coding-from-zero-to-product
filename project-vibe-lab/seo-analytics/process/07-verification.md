# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run metadata
npm run robots
npm run sitemap
npm run events
npm run audit
npm run checklist
npm run prompt
```

预期：

- `npm test`：9 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-public-traffic`。
- `npm run metadata`：输出 title、description 和 OG 标签。
- `npm run events`：输出事件名、触发条件、payload 和隐私风险。
