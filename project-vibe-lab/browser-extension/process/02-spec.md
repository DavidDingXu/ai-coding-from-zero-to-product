# 02 需求边界

## 要做

- 提供 Manifest V3 插件结构。
- popup 里有采集按钮和本地素材卡片。
- 通过当前激活页面读取标题、链接、选中文本和描述。
- 生成素材卡片。
- 使用 `chrome.storage.local` 保存最近 5 条素材。
- 提供本地预览模式。
- 用测试验证核心逻辑、权限边界和提示词。

## 真实需求边界

本轮只验证“用户主动把当前网页素材带回效率助手”这一条路径。

验收标准：

- `host_permissions` 必须为空。
- 权限只保留 `activeTab`、`scripting`、`storage`。
- 采集数据结构只能包含标题、链接、选中文本和描述。
- 没有选中文本时，要提醒素材质量有限。
- 素材卡片必须标明 `privacyLevel: current-tab-user-triggered`。
- popup 本地预览不能写成已经发布到 Chrome Web Store。

## 不做

- 不声明全站 `host_permissions`。
- 不自动爬取网页。
- 不读取 Cookie、密码、表单、私信和登录态。
- 不绕过付费墙和访问控制。
- 不调用真实模型。
- 不上传远程数据库。

## 验证方式

- `npm test` 验证核心逻辑。
- `npm run brief` 验证项目范围。
- `npm run manifest` 验证 Manifest V3 和最小权限。
- `npm run capture` 验证采集数据结构。
- `npm run card` 验证素材卡片。
- `npm run permissions` 验证权限说明和生产级检查项。
- `npm start` 打开 `popup.html` 预览弹窗。
