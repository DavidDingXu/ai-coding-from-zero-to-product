# 05 实现计划

## 步骤 1：先写测试

先把移动端压缩需求写清楚：手机上只保留短输入、3 条推荐、本地收藏、行动文本和发布路径判断。

覆盖这些行为：

- 项目边界。
- 输入归一化。
- 3 条移动端推荐。
- 移动端行动计划。
- 本地收藏记录。
- 分享文本。
- H5 / 小程序发布路径区分。
- 给 Codex App 和 CLI 的提示词。

## 步骤 2：实现核心逻辑

新增 `src/h5-miniapp.js`，导出：

```text
buildH5Brief
normalizeMobileInput
buildTopRecommendations
buildMobileActionPlan
buildFavoriteRecord
buildShareText
buildPublishChecklist
buildAiPrompt
```

## 步骤 3：补 CLI

新增 `src/cli.js`，支持：

```text
brief
plan
recommendations
favorite
share
publish
prompt
```

## 步骤 4：补页面

新增 `index.html`、`styles.css`、`src/app.js`。

页面只做短输入、推荐、本地收藏、行动文本和发布路径，不接真实模型。

这里要特别检查 AI 有没有把 Web App 的 10 条结果、复杂筛选器和完整计划记录搬过来。如果搬过来，说明需求压缩失败。

## 步骤 5：验证

执行：

```bash
npm test
npm run brief
npm run plan
npm run recommendations
npm run favorite
npm run share
npm run publish
npm run prompt
```

再启动本地页面，检查移动端首屏、推荐、收藏和发布路径文案。
