# commercialization：商业化前置账本

这是第 25 篇的配套项目之一。

第 24 篇解决公开访问和基础统计。第 25 篇开始进入商业化，但还不接真实支付。

本项目先把收费前必须算清楚的账做成可运行检查：

- 账号归属；
- 免费、个人版、团队版套餐；
- 月度额度；
- usage meter；
- token 成本；
- 超额策略；
- 支付边界；
- 退款边界；
- 隐私说明；
- 审计日志。

## 快速开始

```bash
cd project-vibe-lab/commercialization
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

## 常用命令

查看套餐：

```bash
npm run plans
```

查看使用量：

```bash
npm run usage
```

计算 token 成本：

```bash
node src/cli.js --mode meter --cost 0.02
```

生成模拟账单：

```bash
node src/cli.js --mode invoice --plan pro
```

默认审查故意不通过：

```bash
npm run audit
```

全部证据齐全时：

```bash
node src/cli.js --mode audit --evidence account-id,plan-definition,quota-policy,usage-meter,cost-model,overage-policy,payment-boundary,refund-policy,privacy-copy,audit-log
```

## 当前不做什么

- 不接真实支付。
- 不保存真实支付密钥。
- 不生成真实发票。
- 不承诺财税合规方案。
- 不把模拟账单写成真实收款。

## 给 Codex App 的任务

```text
打开 project-vibe-lab/commercialization 项目。
先读 README.md、process/02-spec.md 和 test/commercialization.test.js。
请为我的产品「AI 个人效率助手」做商业化前置审查。
必须检查账号、套餐、额度、usage meter、token 成本、超额策略、支付边界、退款边界、隐私说明和审计日志。
输出证据缺口、模拟账单和进入支付沙箱前要补的代码能力。
不要接真实支付，不要写入支付密钥，不要把模拟账单写成真实收款。
```
