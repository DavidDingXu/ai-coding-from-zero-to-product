# 06-implementation-log

## 第 0 轮：先定义后端责任

没有让 AI 直接“加一个后端”，而是先把本轮责任拆成 6 件事：

```text
User / Session：谁在操作
Project：数据属于哪里
EfficiencyRecord：保存什么
Permission：谁能看和写
AuditEvent：写操作怎么追踪
API contract：前后端怎么约定
```

这样做是为了避免一开始就生成复杂框架，却说不清每个接口解决什么问题。

- 新增 `src/light-backend.js`，实现本地数据源、模拟 session、权限检查、草稿保存、API 合同、审计报告和生产级缺口。
- 新增 `test/light-backend.test.js`，覆盖后端分界、数据模型、登录、匿名拒绝、跨项目拒绝、权限矩阵、API 合同、审计和 prompt。
- 新增 `index.html`、`styles.css`、`src/app.js`，让读者能在浏览器里保存草稿、查看权限矩阵和生产缺口。
- 新增 README、`.env.example` 和过程记录。

## 检查容易跑偏的点

- 是否把内存数据说成真实数据库。
- 是否把 demo session 写成生产登录。
- 是否只检查“登录了”，没有检查角色和资源归属。
- 是否有写操作但没有审计事件。
- 是否把真实模型 key 放到前端。

最终保留的是轻量后端 MVP：模拟身份、资源归属、角色权限、API 合同和审计事件，并明确 `productionReady = false`。
