# 04 关键提示词

## Codex App 路线

```text
打开 h5-miniapp 项目。
先读 README.md、process/02-spec.md 和 test/h5-miniapp.test.js。
本轮目标：把完整 Web App 压缩成移动端 H5 版本。
请保留短输入、3 条推荐、本地收藏、行动文本和 H5 / 小程序发布路径提示。
不要接入真实模型、登录、openid、云数据库或真实小程序上传审核。
完成后运行 npm test、npm run plan、npm run share，并打开页面验证移动端首屏。
```

## CLI 路线

```text
cd project-vibe-lab/h5-miniapp
npm test
npm run plan
npm run share
npm start
```

## 迁移到自己的产品

```text
请把我的 Web App 主路径压缩成移动端 H5 版本。
只保留用户在手机上 3 分钟内能完成的动作。
请说明保留什么、删除什么、为什么。
第一版不要接登录、支付、真实模型和小程序提审。
最后给出测试命令、浏览器验证路径和后续可扩展边界。
```

## 防跑偏提示

```text
不要把本地 H5 demo 写成已经上线的小程序。
不要新增真实登录、openid、云数据库和消息订阅。
如果需要说明小程序，只给发布路径检查项。
```
