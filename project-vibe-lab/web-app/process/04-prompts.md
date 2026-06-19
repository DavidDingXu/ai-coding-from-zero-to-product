# 04 关键提示词

## Codex App 路线

```text
打开 web-app 项目。
先读 README.md、process/02-spec.md 和 test/plan-app.test.js。
本轮只做今日计划生成、筛选、复制和本地保存。
不要接入真实模型、登录、支付或远程数据库。
完成后运行 npm test、npm run generate、npm run filter，并打开页面验证。
```

## CLI 路线

```text
在终端进入 project-vibe-lab/web-app。
先读 README.md、process/02-spec.md 和 test/plan-app.test.js。
按测试先行方式实现今日计划生成、筛选、复制和本地保存。
不要接入真实模型、登录、支付或远程数据库。
最后给出 npm test、npm run generate、npm run filter 和页面验证结果。
```

## 用于今日计划生成的产品提示

```text
我要在「AI 个人效率助手」web-app 里生成 10 张今日行动卡。
领域：AI 编程
目标读者：想用 AI 做自己产品的人
内容目标：做出第一个可运行产品
表达场景：公众号
约束：先用本地 demo 验证，不接真实模型和数据库

请先输出行动卡列表，每张行动卡包含标题、适合人群、内容类型、难度、推荐理由和下一步动作。
本轮不要接入真实模型、账号体系、远程数据库或支付。先保证本地生成、筛选、复制和保存可验证。
```
