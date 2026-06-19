# launch-checklist：上线前 7 道闸

这是第 23 篇的配套项目。

前面已经让「AI 个人效率助手」从想法走到多个可演示项目。第 23 篇开始处理：demo 能跑以后，怎么判断它能不能给别人用。

本项目不做真实部署，不接真实支付，也不接真实模型 key。它先把上线前必须检查的 7 道闸做成可测试清单：

- 范围闸；
- 权限闸；
- 隐私闸；
- 成本闸；
- 日志闸；
- 部署闸；
- 回滚闸。

## 快速开始

```bash
cd project-vibe-lab/launch-checklist
npm test
npm run brief
npm run gates
npm run audit
npm run release
npm run rollback
npm run evidence
npm run prompt
```

## 当前能做什么

- 输出上线前 7 道闸。
- 检查每道闸需要哪些证据。
- 根据证据判断发布状态是 `blocked` 还是 `ready-for-small-release`。
- 输出最小发布计划。
- 输出回滚触发条件、动作和证据。
- 生成给 Codex App / CLI 的审查提示词。

## 当前不做什么

- 不做真实部署。
- 不接真实支付。
- 不接真实模型 key。
- 不替代安全、法务或合规审查。
- 不把本地 demo 写成生产可用。

## 关键命令

```bash
npm run gates
npm run audit
npm run release
npm run rollback
```

`npm run audit` 默认使用一组不完整证据，所以会输出 `blocked`。这是刻意的：上线前检查不应该默认通过。

如果想看全部证据齐全的结果：

```bash
node src/cli.js --mode audit --evidence release-scope,disabled-features,known-limits,role-matrix,resource-ownership-tests,denied-audit-events,data-inventory,privacy-copy,delete-export-plan,quota-policy,rate-limit,billing-alert,request-log,audit-log,trace-id,error-dashboard,deploy-command,env-list,health-check,smoke-test,rollback-command,feature-switch,incident-contact,data-backup
```

## 给 Codex App 的任务

```text
打开 launch-checklist 项目。
先读 README.md、process/02-spec.md 和 test/launch-checklist.test.js。
请为我的产品做上线前 7 道闸审查。
必须检查范围、权限、隐私、成本、日志、部署和回滚。
输出 blocked gates、缺失证据、最小发布计划和回滚计划。
不要直接部署，不要接真实支付，不要写入真实模型 key。
```

## 怎么改成你的产品

把你的项目当前证据列出来：

- 本次上线范围；
- 已禁用功能；
- 权限矩阵；
- 数据清单；
- 隐私文案；
- 额度和限流；
- 日志和审计；
- 部署命令；
- 回滚命令。

然后运行：

```bash
node src/cli.js --mode audit --evidence release-scope,disabled-features,known-limits
```

先看哪些 gate 被 blocked，再补证据。

不要让 AI 直接“帮我上线”。先让它做审查。
