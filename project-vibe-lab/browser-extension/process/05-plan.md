# 05 实现计划

1. 先写清插件需求边界：用户点击触发、当前页面、选中文本、本地素材卡片。
2. 建立 Manifest V3 最小插件结构，先锁住权限。
3. 写核心逻辑测试，覆盖 brief、manifest、capture、card、permissions、prompt。
4. 实现 `src/browser-extension.js`。
5. 实现 CLI，方便验证采集结构、素材卡片和权限说明；CLI 不是实战主体。
6. 实现 popup 页面和本地预览模式。
7. 实现 service worker badge。
8. 补 README 和过程文档。
9. 生成真实 popup 截图，并记录验证证据。

取舍：

- 当前 MVP 用 `activeTab`，不声明全站 host permissions。
- 采集逻辑由用户点击触发，不做自动后台爬取。
- 模型总结和远程同步放到生产级升级路线。
