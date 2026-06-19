# browser-extension：AI 读书笔记助手

这是「AI 个人效率助手」的第四个实战项目。

前面我们已经做了官网、网页应用和 H5 形态。这个项目换一个入口：用户正在浏览网页文章时，顺手把当前页面的标题、链接和选中文本采集成素材卡片，再带回AI 个人效率助手生成今日行动卡。

当前版本是 Manifest V3 浏览器插件 MVP。它不做全站爬取，不读取 Cookie、表单、私信和登录态，也不自动上传远程数据库。

## 快速开始

```bash
cd project-vibe-lab/browser-extension
npm test
npm run brief
npm run manifest
npm run permissions
```

本地预览弹窗：

```bash
npm start
```

浏览器访问：

```text
http://127.0.0.1:5177/popup.html
```

真实安装插件时，在 Chrome 扩展管理页打开“开发者模式”，选择“加载已解压的扩展程序”，目录选择本项目根目录。

## 当前能做什么

- 使用 Manifest V3。
- 通过工具栏 popup 触发采集。
- 只读取当前激活页面。
- 采集页面标题、链接、选中文本和 meta description。
- 生成本地素材卡片。
- 使用 `chrome.storage.local` 保存最近 5 条素材。
- 在本地预览模式下使用示例数据，不依赖 Chrome API。

## 当前不做什么

- 不声明 `https://*/*` 或 `http://*/*` 全站权限。
- 不自动爬取网页。
- 不读取 Cookie、密码、表单、私信和登录态。
- 不绕过付费墙、公司内网页权限或网站访问控制。
- 不调用真实模型总结网页。
- 不上传远程数据库。

## 目录结构

```text
browser-extension/
├── manifest.json
├── popup.html
├── popup.css
├── src/
│   ├── browser-extension.js
│   ├── cli.js
│   ├── popup.js
│   └── service-worker.js
├── test/
│   └── browser-extension.test.js
├── process/
└── package.json
```

## 关键命令

```bash
npm test
npm run capture
npm run card
npm run permissions
npm run prompt
```

`npm run manifest` 会输出当前 manifest 的权限摘要：

```text
manifest_version
action.default_popup
permissions
host_permissions
service_worker
riskLevel
```

`host_permissions` 应该是空数组。MVP 通过 `activeTab` 和用户点击动作读取当前页面，不提前申请全站访问。

## 生产级升级缺口

这个项目当前只是插件 MVP。进入生产级前，至少要补：

- 权限说明，让普通用户知道插件读取什么、不读取什么。
- 敏感页面排除，例如邮箱、网银、后台、内网页面和表单页面。
- 采集数据导出、删除和清空。
- 远程同步时的账号、鉴权和加密。
- 真实模型总结时的额度、限流、缓存和失败降级。
- Chrome Web Store 发布材料和隐私政策。

## 给 Codex App 的任务

```text
打开 browser-extension 项目。
先读 README.md、process/02-spec.md、manifest.json 和 test/browser-extension.test.js。
本轮目标：开发「AI 读书笔记助手」浏览器插件 MVP。
插件使用 Manifest V3，只声明 activeTab、scripting、storage。
MVP 只采集当前激活页面的标题、链接、选中文本和描述，生成本地素材卡片。
不要声明全站 host_permissions，不要采集登录态、Cookie、表单、私信或不可公开内容。
完成后运行 npm test、npm run manifest、npm run permissions，并打开 popup.html 预览界面。
```

## 怎么改成你的产品

如果你的产品不是AI 个人效率助手，把素材卡片里的字段换成你的业务对象：

- 简历产品：采集招聘 JD，生成简历修改建议。
- 学习产品：采集文章段落，生成复习卡片。
- 运营产品：采集竞品页面，生成活动素材。
- 知识库产品：采集网页段落，生成待整理笔记。

先保留“用户主动点击、当前页面、选中文本、本地保存”这条最小路径。等这条路径跑稳，再考虑同步、账号、团队协作和模型总结。
