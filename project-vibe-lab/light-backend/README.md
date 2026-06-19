# light-backend：什么时候需要数据库、登录和权限

这是「AI 个人效率助手」的后端边界实战项目。

前面的官网、网页应用、H5/小程序形态和浏览器插件都能在本地跑起来。但只要产品开始跨设备、多人协作、保存用户数据、保护模型 key 或准备商业化，就不能只靠浏览器本地存储。

这个项目做一个轻量后端 MVP。它不接真实数据库，不做真实密码登录，也不托管真实模型 key。它训练的是后端进入项目时最重要的几件事：数据模型、登录会话、资源权限、API 合同、审计事件和生产升级边界。

## 快速开始

```bash
cd project-vibe-lab/light-backend
npm test
npm run brief
npm run decision
npm run session
npm run save
npm run list
npm run permissions
npm run api
npm run production
```

本地预览页面：

```bash
npm start
```

浏览器访问：

```text
http://127.0.0.1:5180
```

## 当前能做什么

- 判断 localStorage 和轻量后端的分界。
- 用内存数据模拟用户、项目、草稿和审计事件。
- 创建本地 demo session。
- 按角色和项目成员检查权限。
- 保存和查询计划草稿。
- 输出 API 合同。
- 输出权限矩阵和生产级升级缺口。

## 当前不做什么

- 不连接真实数据库。
- 不实现真实密码登录、OAuth 或短信登录。
- 不托管真实模型 key。
- 不处理真实支付、扣费、发票或用户隐私数据。
- 不把本地内存数据当成生产存储。

## 目录结构

```text
light-backend/
├── index.html
├── styles.css
├── src/
│   ├── light-backend.js
│   ├── app.js
│   └── cli.js
├── test/
│   └── light-backend.test.js
├── process/
├── .env.example
└── package.json
```

## 关键命令

```bash
npm run decision
npm run model
npm run session
npm run save
npm run list
npm run permissions
npm run api
npm run audit
npm run production
```

`npm run permissions` 能看到匿名、viewer、editor 和 owner 的权限差异。

`npm run production` 会列出从本地 MVP 走向生产级后端必须补的内容：数据库迁移、真实登录、资源级权限、密钥代理、日志审计和隐私数据生命周期。

## 给 Codex App 的任务

```text
打开 light-backend 项目。
先读 README.md、process/02-spec.md 和 test/light-backend.test.js。
请把这个项目作为 AI 个人效率助手的轻量后端 MVP：模拟登录、按项目成员做权限检查、保存计划草稿、输出 API 合同和审计报告。
第一版不要接真实数据库、真实密码登录、真实模型 key、支付或用户隐私数据。
完成后运行 npm test、npm run save、npm run list、npm run permissions、npm run api、npm run production，并打开本地页面验证。
```

## 给 CLI 读者的任务

```bash
cd project-vibe-lab/light-backend
npm test
npm run save
npm run list
npm run permissions
npm run api
npm start
```

页面打开后，保存一条草稿，再看权限矩阵和生产级缺口。

## 怎么改成你的产品

先回答 5 个问题：

- 哪些数据必须跨设备保存？
- 哪些数据属于某个用户或团队？
- 哪些动作必须登录后才能做？
- 哪些动作不同角色权限不同？
- 哪些 key、日志和敏感数据不能放在客户端？

再让 AI 改项目：

```text
请把 light-backend 改成我的产品的轻量后端 MVP。
产品：简历优化器。
第一版只做：用户、项目、简历草稿、模拟 session、权限检查、API 合同和审计事件。
不要接真实数据库、真实密码登录、真实模型 key 或支付能力。
请先更新测试，再改 src，最后运行 npm test、npm run permissions、npm run api、npm run production。
```

这个项目的重点不是后端技术栈，而是后端进入产品时必须补齐的工程边界。
