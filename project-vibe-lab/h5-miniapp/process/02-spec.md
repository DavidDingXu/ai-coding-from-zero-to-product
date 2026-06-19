# 02 需求整理

## 本轮目标

完成一个可运行的 H5 页面，支持：

- 输入产品名。
- 输入领域。
- 输入目标读者。
- 输入使用场景。
- 输入时间预算。
- 输入发布目标。
- 输入今天的素材。
- 生成 3 条移动端推荐。
- 收藏一条推荐到浏览器本地。
- 清空本地收藏。
- 生成可复制到聊天或笔记的行动文本。
- 展示 H5 链接验证和小程序提审准备的差异。
- 用测试和 CLI 验证核心逻辑。

这一轮要验证的真实需求是：用户在手机上用短输入完成一次今日行动整理，而不是在移动端维护完整工作台。

## 本轮不做

- 不调用真实模型。
- 不做真实小程序上传审核。
- 不接登录、openid、云数据库和消息订阅。
- 不收集手机号、身份证、公司内部资料。
- 不做支付、会员和额度系统。

## 验收标准

- 页面主路径能在手机宽度下完成：输入短记录、生成 3 条推荐、收藏、复制行动文本。
- 推荐数量固定为 3 条，不把 Web App 的 10 条候选和筛选器照搬过来。
- 收藏记录标明 `storage: local-demo`，不能写成多端同步。
- H5 链接验证和小程序提审准备分开表达。
- README、文章、页面和测试都说明当前不接真实模型、登录、openid 和云数据库。

## 数据结构

推荐项包含：

```text
id
rank
label
title
product
domain
audience
scene
timeBudget
publishTarget
materialUsed
mobileFit
mobileReason
quickAction
shareLine
```

收藏记录包含：

```text
recommendationId
title
label
storage
source
note
savedAt
```

发布检查包含：

```text
route
requiredChecks
warnings
```

## 验证方式

- `npm test` 验证核心逻辑。
- `npm run brief` 验证项目范围。
- `npm run plan` 验证移动端行动计划。
- `npm run recommendations` 验证 3 条推荐输出。
- `npm run favorite` 验证本地收藏记录结构。
- `npm run share` 验证行动文本。
- `npm run publish` 验证 H5 和小程序发布路径区分。
- `npm start` 打开页面，手动验证短输入、推荐、收藏、清空和行动文本。
