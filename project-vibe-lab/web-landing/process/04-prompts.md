# 04 prompts

## Codex App 路线

```text
打开 web-landing 项目。

先读 README.md 和 process/02-spec.md，再看 test/landing-page.test.js。
本轮目标：开发「AI 个人效率助手」官网第一版。

只做官网、候补表单、本地校验和页面内反馈。
不要接入真实模型、登录、支付或远程数据库。

请先给出计划，再小步修改文件。
完成后运行 npm test，并用 npm start 打开页面验证表单。
最后把验证结果写回 process/07-verification.md。
```

## CLI 路线

```text
在终端进入 project-vibe-lab/web-landing。

先读 README.md、process/02-spec.md 和 test/landing-page.test.js。
请按测试先行方式实现官网第一版。

约束：
- 不接入真实模型。
- 不做登录、支付和远程数据库。
- 表单只做本地校验。
- README 和 process 要同步更新。

完成后运行 npm test、npm run feedback，并说明浏览器页面验证结果。
```

## 为什么这样写

提示词先给目标，再给范围，再给验证动作。这样 AI 不容易把官网项目扩大成完整 SaaS。
