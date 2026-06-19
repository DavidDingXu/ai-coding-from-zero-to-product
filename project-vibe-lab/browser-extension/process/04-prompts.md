# 04 关键提示词

```text
请开发「AI 读书笔记助手」浏览器插件 MVP。

先读 README.md、process/02-spec.md、manifest.json 和 test/browser-extension.test.js。

要求：
1. 使用 Manifest V3。
2. popup 点击后只采集当前激活页面。
3. 采集标题、链接、选中文本和 meta description。
4. 生成本地素材卡片并保存到 chrome.storage.local。
5. 不声明全站 host_permissions。
6. 不读取 Cookie、密码、表单、私信和登录态。
7. 不调用真实模型，不上传远程数据库。

完成后运行 npm test、npm run manifest、npm run permissions，并打开 popup.html 预览界面。
```

提示词重点：

- 明确最小权限。
- 明确采集范围。
- 明确不做全站爬取和敏感数据。
- 明确验证命令。
