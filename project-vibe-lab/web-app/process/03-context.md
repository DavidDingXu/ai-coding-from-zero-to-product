# 03 给 AI 的上下文

本项目属于「AI 个人效率助手」主线。

前置项目：

- `docs/vibe-practice-route.md`：定义主线产品和多项目拆解。
- `web-landing`：官网、候补表单和本地校验。

当前项目：

- `web-app`：今日计划生成、筛选、复制和本地保存。

本轮需要读的文件：

```text
README.md
process/02-spec.md
test/plan-app.test.js
src/plan-app.js
index.html
styles.css
```

本轮不用读的内容：

- 其他模块文章全文。
- 后续 H5、插件、App、Agent 的规划。
- 国内模型章节的完整代码。

关键边界：

- 页面上的“生成”当前是本地规则生成，不是模型生成。
- localStorage 只能证明本地保存路径，不代表有远程账号和数据同步。
- 文章里不能把当前 demo 写成已经接入真实模型。
