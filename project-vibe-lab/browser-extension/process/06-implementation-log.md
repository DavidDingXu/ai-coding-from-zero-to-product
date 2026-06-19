# 06 实现记录

## 第 0 轮：先压住插件权限

原始需求是“把网页素材带回 AI 个人效率助手”。这里没有让 AI 直接写一个全能采集插件，而是先把边界压到：

```text
用户点击 -> 当前页面 -> 选中文本 -> 本地素材卡片
```

这个判断很重要。浏览器插件如果一开始申请全站权限、后台爬取或远程上传，后面很难解释隐私边界。

## 红灯

先写 `test/browser-extension.test.js`，覆盖权限、素材卡片和生产级边界。

## 绿灯

实现：

- `manifest.json`
- `popup.html`
- `popup.css`
- `src/browser-extension.js`
- `src/popup.js`
- `src/service-worker.js`
- `src/cli.js`

运行：

```bash
npm test
```

预期：

```text
tests 8
pass 8
```

## 检查容易跑偏的点

- 是否声明了 `https://*/*` 或 `http://*/*` 全站权限。
- 是否读取 Cookie、表单、私信或登录态。
- 是否自动后台爬取网页。
- 是否把本地素材卡片写成真实模型总结。
- 是否把本地预览写成已经发布的浏览器商店插件。

最终保留的是最小权限 MVP：`activeTab`、`scripting`、`storage`，并且 `host_permissions` 为空。
