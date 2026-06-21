# web-app：今日计划生成、筛选、复制和本地保存

这是「AI 个人效率助手」的第二个项目。

第一个项目 `web-landing` 只做官网和候补表单，证明产品入口能打开、用户反馈能本地校验。本项目开始进入真正的网页应用：输入任务、日程、笔记和账目，生成 10 张今日行动卡，并支持筛选、复制和本地保存。

当前版本不调用真实模型，也不写远程数据库。这样做是为了先把产品主流程、页面交互和验证方式跑稳。后续接 DeepSeek、千问、OpenAI 兼容网关或后端服务时，再替换生成层和保存层。

## 先看到 Web App

进入项目目录：

```bash
cd project-vibe-lab/web-app
```

打开本地页面：

```bash
npm start
```

浏览器访问：

```text
http://127.0.0.1:5175
```

页面打开后，先走一遍用户路径：改一次任务、日程或笔记，生成新的行动卡；筛选 `easy`；复制一条；保存一条；刷新页面确认本地计划记录还在。

## 再看验证证据

页面主路径跑通后，再用命令确认核心逻辑没有被改坏：

```bash
npm test
npm run verify
npm run brief
npm run generate
npm run filter
npm run save
npm run checklist
```

`verify` 会同时跑测试、生成/筛选命令和页面关键文案检查。

## 当前能做什么

- 根据任务、日程、笔记、账目和约束生成 10 张结构化行动卡。
- 每张行动卡包含标题、人群、类型、难度、阶段、推荐理由和下一步动作。
- 按难度、内容类型和目标阶段筛选。
- 复制单张行动卡。
- 保存计划记录到浏览器 localStorage。
- 清空本地计划记录。
- 用 Node.js 测试验证核心逻辑。

## 当前不做什么

- 不接真实模型。
- 不写远程数据库。
- 不做登录、团队协作和权限。
- 不接支付和额度系统。
- 不自动发送真实提醒。

这些能力会在后续项目里分批接入。第一版先保证主流程能跑，边界能说清，测试能证明。

## 目录结构

```text
web-app/
├── index.html
├── styles.css
├── src/
│   ├── app.js
│   ├── cli.js
│   └── plan-app.js
├── test/
│   └── plan-app.test.js
├── process/
│   ├── 01-idea.md
│   ├── 02-spec.md
│   ├── 03-context.md
│   ├── 04-prompts.md
│   ├── 05-plan.md
│   ├── 06-implementation-log.md
│   ├── 07-verification.md
│   └── 08-review.md
├── .env.example
└── package.json
```

## 关键文件

`src/plan-app.js` 是核心逻辑。页面和 CLI 都调用它，避免页面能跑但命令不能验证。

`src/app.js` 是浏览器交互。它负责读取表单、渲染行动卡、处理筛选、复制和本地保存。

`src/cli.js` 给熟悉终端的读者做验证用。你可以在终端快速看生成、筛选、保存和检查清单。

`test/plan-app.test.js` 覆盖范围、默认输入、生成、筛选、保存、提示词和验证清单。

## 给 Codex App 的任务

```text
打开 web-app 项目。
先按 README 打开本地页面，走一遍生成、筛选、复制和保存路径。
再读 process/02-spec.md 和 test/plan-app.test.js。
本轮只做今日计划生成、筛选、复制和本地保存。
不要接入真实模型、登录、支付或远程数据库。
完成后先打开页面验证，再运行 npm run verify。
```

## 给熟悉终端读者的验证命令

```text
cd project-vibe-lab/web-app
npm start
npm run verify
npm run generate
npm run filter
```

## 后续怎么扩展

下一步可以有三条路线：

- 把 `generateActionCards` 换成模型 dry-run，先记录请求体和响应解析，不急着接真实 Key。
- 把 localStorage 换成轻量后端 API，开始处理用户、数据和权限边界。
- 把同一套输入压缩成 H5 / 小程序形态，验证手机端场景。
