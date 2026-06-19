# 07-verification

已执行：

```bash
npm test
npm run brief
npm run decision
npm run model
npm run session
npm run save
npm run list
npm run permissions
npm run api
npm run audit
npm run production
npm run prompt
```

结果：

- `npm test`：14 条测试通过。
- `npm run brief`：输出 MVP 范围和不做什么。
- `npm run decision`：输出本地保存和后端进入的分界。
- `npm run model`：输出 User、Session、Project、EfficiencyRecord、AuditEvent。
- `npm run session`：输出本地 demo session。
- `npm run save`：保存一条草稿。
- `npm run list`：查询项目草稿。
- `npm run permissions`：输出匿名、viewer、editor、owner 权限矩阵。
- `npm run api`：输出 5 个 API 合同。
- `npm run audit`：输出审计事件证据。
- `npm run production`：输出 6 类生产级缺口。
- `npm run prompt`：输出 Codex App 跟练提示。

页面验证：

- 访问 `http://127.0.0.1:5180`。
- 页面展示后端分界、当前会话、保存草稿、权限矩阵和生产级缺口。
- 点击“保存草稿”后，草稿列表新增一条记录。
- 已生成截图 `light-backend-page-screenshot.png`。
