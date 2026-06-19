# payment-sandbox：支付沙箱流程

这是第 25 篇的配套项目之一。

同一篇前半段先把商业化前置账本做出来：账号、套餐、额度、usage meter、token 成本和支付前 evidence。这里继续往前走，但仍然不接真实支付通道。

本项目只验证支付沙箱需要的工程能力：

- 订单状态机；
- 支付路线选择；
- Webhook 原始 body 验签；
- 重复回调幂等；
- 支付成功后开通权益；
- 支付失败和退款模拟；
- 审计日志；
- 生产密钥隔离。

主线只保留国内读者常用路线：本地沙箱、支付宝沙箱和微信支付测试路线。其他支付服务商不在这套专栏里展开。

## 快速开始

```bash
cd project-vibe-lab/payment-sandbox
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

## 常用命令

查看范围：

```bash
npm run brief
```

查看支付路线：

```bash
npm run routes
```

创建沙箱订单：

```bash
node src/cli.js --mode order --plan pro --provider local-sandbox --user u-demo-01
```

模拟支付成功回调：

```bash
npm run webhook
```

模拟支付失败：

```bash
node src/cli.js --mode webhook --event payment.failed
```

模拟退款：

```bash
npm run refund
```

默认审查故意不通过：

```bash
npm run audit
```

全部证据齐全时：

```bash
node src/cli.js --mode audit --evidence order-state-machine,webhook-signature,idempotency-key,entitlement-sync,refund-flow,audit-log,no-production-key,provider-doc-check
```

## 当前不做什么

- 不接真实支付通道。
- 不保存生产支付密钥。
- 不生成真实收款记录。
- 不替代商户资质、税务或合规判断。
- 不把服务商沙箱流程写成生产可用流程。

## 给 Codex App 的任务

```text
打开 project-vibe-lab/payment-sandbox 项目。
先读 README.md、process/02-spec.md 和 test/payment-sandbox.test.js。
请为我的产品「AI 个人效率助手」设计支付沙箱流程。
必须覆盖订单状态、Webhook 验签、幂等处理、支付失败、退款模拟、权益开通和审计日志。
输出证据缺口、沙箱事件样例、退款样例和进入服务商沙箱前要补的代码能力。
不要接真实支付，不要写入生产密钥，不要把沙箱结果写成真实收款。
```
