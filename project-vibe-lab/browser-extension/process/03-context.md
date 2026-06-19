# 03 项目上下文

关键文件：

```text
manifest.json
popup.html
popup.css
src/browser-extension.js
src/popup.js
src/service-worker.js
test/browser-extension.test.js
```

上游项目：

- `web-app`：今日计划生成、筛选和本地保存。
- `h5-miniapp`：移动端短输入和行动文本。
- `docs/vibe-practice-route.md`：生产级升级路线。

官方能力边界：

- Chrome 扩展需要根目录 `manifest.json`。
- Manifest V3 使用 `manifest_version: 3`。
- `action.default_popup` 是工具栏 popup 入口。
- 程序化注入脚本需要 `scripting`，并需要 `activeTab` 或 host permissions。
- 扩展状态优先使用 `chrome.storage`，不要依赖网页 `localStorage`。
