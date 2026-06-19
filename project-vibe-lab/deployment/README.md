# deployment：部署实战 runbook

这是第 24 篇的配套项目之一。

第 23 篇已经把上线前检查拆成 7 道闸。第 24 篇开始进入部署，但本项目不会替你登录云平台，也不会写入真实 token。

它做的是部署前的工程准备：

- 判断 CloudBase、EdgeOne Pages、轻量后端分别适合什么场景；
- 输出小范围部署 runbook；
- 检查环境变量、preview URL、health check、smoke test 和回滚证据；
- 生成给 Codex App / CLI 的部署审查提示词。

## 快速开始

```bash
cd project-vibe-lab/deployment
npm test
npm run brief
npm run platforms
npm run choose
npm run runbook
npm run commands
npm run audit
npm run evidence
npm run smoke
npm run rollback
npm run prompt
```

## 常用命令

按国内 H5 / 小程序路线选择平台：

```bash
node src/cli.js --mode choose --region domestic --needs miniapp
```

按模型代理和数据库路线选择平台：

```bash
node src/cli.js --mode choose --region domestic --needs model-proxy,database
```

查看 EdgeOne Pages 命令边界：

```bash
node src/cli.js --mode commands --platform edgeone-pages
```

默认审查故意不通过：

```bash
npm run audit
```

全部证据齐全时：

```bash
node src/cli.js --mode audit --evidence release-scope,build-command,output-dir,env-list,preview-url,health-check,smoke-test,rollback-command,previous-artifact,incident-contact
```

## 当前不做什么

- 不替你登录腾讯云或 EdgeOne。
- 不保存真实 token。
- 不执行真实生产部署。
- 不接真实支付。
- 不承诺任何平台当前 UI 长期不变。

## 官方资料入口

平台 UI 和命令会更新，真实发布前要重新打开官方文档确认 CloudBase、EdgeOne Pages 或你实际使用的云平台命令。

## 给 Codex App 的任务

```text
打开 project-vibe-lab/deployment 项目。
先读 README.md、process/02-spec.md 和 test/deployment.test.js。
请为我的产品「AI 个人效率助手」制定小范围部署方案。
必须输出平台选择理由、部署 runbook、环境变量清单、preview 验证、smoke test 和回滚计划。
不要替我登录云平台，不要写入真实 token，不要直接发布生产环境。
```
