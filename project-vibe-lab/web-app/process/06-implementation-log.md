# 06 实现记录

## 第 0 轮：从官网反馈推进到应用需求

`web-landing` 已经验证官网入口，但还没有让用户完成核心动作。本轮先把需求收成一句话：

```text
用户手动输入任务、日程、笔记、账目和今日目标，系统生成 10 张今日行动卡，用户可以筛选、复制和本地保存。
```

这里特意没有接真实模型，也没有接远程数据库。

原因：

- 真实模型会引入 Key、费用、输出格式和错误处理，容易掩盖页面主流程问题。
- 远程数据库会引入账号、权限、隐私和部署，超出本轮验证范围。
- 先用确定性规则生成，能看清输入结构、输出字段、筛选和保存是否成立。

## 第一轮：测试先行

先创建 `test/plan-app.test.js` 和最小 `package.json`。

第一次运行：

```bash
npm test
```

结果：测试失败，原因是 `src/plan-app.js` 不存在。

随后补充占位导出，再次运行测试，失败落到业务断言上：项目范围、默认输入、生成 10 张行动卡、筛选、本地保存、提示词和检查清单都还未实现。

这一步的价值是让 AI 先面对验收标准，而不是先堆页面。

## 第二轮：核心逻辑

实现 `src/plan-app.js`：

- `buildAppBrief`
- `normalizePlanInput`
- `generateActionCards`
- `filterActionCards`
- `buildSavedActionCardRecord`
- `buildPlanPrompt`
- `buildLaunchChecklist`
- `buildAiPrompt`

运行 `npm test` 后 7 个测试通过。

这里的关键取舍是把核心规则放在 `plan-app.js`，没有写进页面组件。后面接模型时，优先替换 `generateActionCards`；后面接后端时，优先替换保存层。

## 第三轮：页面和 CLI

新增：

- `src/cli.js`
- `src/app.js`
- `index.html`
- `styles.css`
- `.env.example`

页面支持输入、生成、筛选、复制、保存、刷新保留和清空。

CLI 支持：

- `npm run brief`
- `npm run generate`
- `npm run filter`
- `npm run save`
- `npm run checklist`
- `npm run prompt`

CLI 只作为验证工具。真正给读者看的主路径仍然是浏览器页面里的输入、生成、筛选、复制和保存。

## 第四轮：文字细节

命令输出里发现部分中文和 `AI 编程` 粘连，例如“做 AI 编程工具”。已调整模板，改成「AI 编程」这类更清楚的表达。

## 第五轮：检查容易跑偏的点

本轮重点检查了 4 个风险：

- 页面是否暗示已经接入真实模型。
- 保存记录是否被写成远程保存。
- 输入区是否诱导用户填写 API Key 或真实隐私数据。
- 测试是否只验证函数，不验证产品边界。

最终保留的说法是：当前版本是本地规则生成和 localStorage 保存。它验证交互和数据结构，不证明模型质量、账号体系、多端同步和自动提醒。
