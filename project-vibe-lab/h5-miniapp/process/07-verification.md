# 07 验证记录

## 已执行

```bash
npm test
```

结果：

```text
tests 8
pass 8
fail 0
```

```bash
npm run brief
npm run plan
npm run recommendations
npm run favorite
npm run share
npm run publish
npm run prompt
```

结果：

- `brief` 输出 H5 项目范围和不做范围。
- `plan` 输出移动端短输入、3 条推荐和行动文本步骤。
- `recommendations` 输出 3 条移动端推荐。
- `favorite` 输出 `storage: local-demo` 的收藏记录。
- `share` 输出可复制到聊天或笔记的行动文本。
- `publish` 分别输出 H5 和小程序检查项。
- `prompt` 输出给 Codex App 的任务提示。

## 浏览器验证

```bash
npm start
```

打开：

```text
http://127.0.0.1:5176
```

需要检查：

- 页面标题为「AI 个人效率助手 H5」。
- 首屏没有横向溢出。
- 修改领域、读者和素材后，点击生成能刷新 3 条推荐。
- 点击收藏后，本地收藏列表出现记录。
- 点击清空后，本地收藏列表清空。
- 行动文本包含当前推荐、领域、读者、素材和下一步。
- 发布路径同时展示 H5 和小程序准备项，并明确当前项目不做真实小程序提审。

## 未证明

- 没有验证真实微信小程序上传审核。
- 没有验证真实模型调用。
- 没有验证登录、openid、云数据库和消息订阅。
- 没有验证生产环境域名、备案和平台审核。
