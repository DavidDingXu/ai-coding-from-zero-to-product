# 03 context

本项目承接：

```text
docs/vibe-practice-route.md
```

关键输入：

- 产品名：AI 个人效率助手
- 第一个项目：web-landing
- 目标：做出产品首页、价值说明和候补表单
- 后续项目：web-app 负责真正的今日计划生成

本项目关键文件：

```text
README.md
index.html
styles.css
src/landing-page.js
src/app.js
src/cli.js
test/landing-page.test.js
process/02-spec.md
```

给 AI 的上下文顺序：

1. 先读 `README.md`。
2. 再读 `process/02-spec.md`。
3. 再读 `test/landing-page.test.js`。
4. 最后看 `index.html`、`styles.css`、`src/`。

不要把后续实战项目全部塞进本轮上下文。只需要知道 `web-landing` 是第一个官网实战，用来验证产品表达、候补表单和本地反馈。
