# AI 产品简报生成器

这是《从想法到产品：普通人的 AI 编程实战》的第一个小产品。它把一个模糊产品想法整理成 AI 编程工具能继续执行的产品简报和提示词。

## 先看到页面

刚开始不要先读完整 `process/`，也不要先跑测试。先把页面打开，看到“一个想法怎样变成产品简报”。

```bash
npm start
```

启动后打开：

```text
http://localhost:5173
```

你应该看到：

- 左侧是产品想法表单。
- 点击“生成简报”后，右侧会出现产品简报和给 AI 编程工具的提示词。
- 点击“复制提示词”可以复制生成结果。

## 再看过程

页面跑起来以后，再看 AI 编程过程。这个项目的重点不是最终源码，而是从想法到页面的推进方式。

建议按顺序阅读：

```text
process/01-idea.md
process/02-spec.md
process/03-context.md
process/04-prompts.md
process/05-plan.md
process/06-implementation-log.md
process/07-verification.md
process/08-review.md
```

看过程时重点关注：想法怎样收窄成第一版、哪些能力暂时不做、AI 任务怎样拆小、最后用什么证据确认页面没有跑偏。

## 最小验证

```bash
npm test
npm run verify
```

期望看到 Node 测试全部通过，`verify` 会同时检查页面里仍然包含关键文案。

## 跟练建议

先从 `process/04-prompts.md` 里的小改造提示词开始，给产品简报增加一个字段，例如“上线前检查”。

推荐顺序：

1. 先在页面上想清楚这个字段应该放在哪里。
2. 再改页面表单和 `src/brief-builder.js`。
3. 打开浏览器确认新字段能生成结果。
4. 最后运行 `npm run verify`，确认页面和核心逻辑都没坏。
