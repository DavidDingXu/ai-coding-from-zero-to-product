# feedback-loop：运营反馈闭环

这是第 26 篇的配套项目。

前面已经把 demo 收紧到小范围试用状态。第 26 篇继续处理试用后的反馈：不把一句“这个不好用”直接丢给 AI 改代码，而是先保留原始反馈，再分类、提取事实、更新 spec、拆任务、写验证方式和用户回复。

本项目覆盖：

- 原始反馈 inbox；
- 反馈分类；
- 事实、判断、假设分离；
- 从反馈生成 spec；
- 从 spec 拆下一轮任务；
- 准备检查；
- 给用户的回复边界。

## 快速开始

```bash
cd project-vibe-lab/feedback-loop
npm test
npm run brief
npm run inbox
npm run classify
npm run extract
npm run spec
npm run tasks
npm run audit
npm run checklist
npm run prompt
```

## 常用命令

查看范围：

```bash
npm run brief
```

查看原始反馈：

```bash
npm run inbox
```

分类反馈：

```bash
npm run classify
```

提取事实、判断和假设：

```bash
npm run extract
```

生成 spec 草稿：

```bash
npm run spec
```

生成下一轮任务：

```bash
npm run tasks
```

默认审查故意不通过：

```bash
npm run audit
```

全部证据齐全时：

```bash
node src/cli.js --mode audit --evidence raw-feedback,classification,fact-extraction,spec-update,task-queue,verification-plan,user-reply
```

## 当前不做什么

- 不把单条反馈直接当需求。
- 不直接让 AI 改代码。
- 不承诺每条反馈都会做。
- 不把反馈整理写成客服话术。

## 给 Codex App 的任务

```text
打开 project-vibe-lab/feedback-loop 项目。
先读 README.md、process/02-spec.md 和 test/feedback-loop.test.js。
请把我的产品「AI 个人效率助手」的小范围试用反馈整理成下一轮 AI 编程任务。
必须保留原始反馈，先分类，再提取事实、判断和假设，然后更新 spec，最后拆成小任务和验证方式。
输出证据缺口、spec 草稿、任务队列、验证计划和给用户的回复要点。
不要直接改代码，不要把单条反馈直接当需求，不要承诺没有排期的功能。
```
