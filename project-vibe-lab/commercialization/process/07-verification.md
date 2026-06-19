# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run plans
npm run usage
npm run meter
npm run invoice
npm run audit
npm run checklist
npm run prompt
```

预期：

- `npm test`：9 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-payment-sandbox`。
- `npm run invoice`：输出 draft 状态的模拟账单。
- `npm run meter`：输出 token 成本和毛利估算。
