# 04-prompts

关键提示词：

```text
打开 project-vibe-lab/payment-sandbox 项目。
先读 README.md、process/02-spec.md 和 test/payment-sandbox.test.js。
请为我的产品「AI 个人效率助手」设计支付沙箱流程。
必须覆盖订单状态、Webhook 验签、幂等处理、支付失败、退款模拟、权益开通和审计日志。
输出证据缺口、沙箱事件样例、退款样例和进入服务商沙箱前要补的代码能力。
不要接真实支付，不要写入生产密钥，不要把沙箱结果写成真实收款。
```

这样写的原因：任务先锁住沙箱边界，再让 AI 输出证据和下一步能力，避免它直接生成生产支付接入代码。
