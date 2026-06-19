# 07-verification

需要执行：

```bash
npm test
npm run brief
npm run routes
npm run order
npm run webhook
npm run refund
npm run audit
npm run checklist
npm run prompt
```

预期：

- `npm test`：11 条测试通过。
- `npm run audit`：默认输出 `blocked`。
- 全证据 audit：输出 `ready-for-provider-sandbox`。
- `npm run webhook`：支付成功后订单 `paid`，权益 active。
- `npm run refund`：退款后订单 `refunded`，权益 inactive。
