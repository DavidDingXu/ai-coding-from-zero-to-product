import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAiPrompt,
  buildFavoriteRecord,
  buildH5Brief,
  buildMobileActionPlan,
  buildPublishChecklist,
  buildShareText,
  buildTopRecommendations,
  normalizeMobileInput
} from "../src/h5-miniapp.js";

test("buildH5Brief keeps the mobile version focused on a short product path", () => {
  const brief = buildH5Brief();

  assert.equal(brief.productName, "AI 个人效率助手");
  assert.equal(brief.projectId, "h5-miniapp");
  assert.ok(brief.inScope.includes("移动端短输入"));
  assert.ok(brief.inScope.includes("生成 3 条今日行动建议"));
  assert.ok(brief.inScope.includes("生成可分享的行动文本"));
  assert.ok(brief.outOfScope.includes("真实小程序上传审核"));
  assert.ok(brief.outOfScope.includes("真实模型调用"));
});

test("normalizeMobileInput trims input and applies mobile friendly defaults", () => {
  const input = normalizeMobileInput({
    product: " AI 个人效率助手 ",
    domain: " 工作和学习 ",
    audience: " 上班族 ",
    scene: " 地铁上 ",
    timeBudget: " 15 分钟 ",
    material: " 今天有 2 个任务、1 个会议和一篇待读文章 ",
    publishTarget: " 微信私聊 "
  });

  assert.deepEqual(input, {
    product: "AI 个人效率助手",
    domain: "工作和学习",
    audience: "上班族",
    scene: "地铁上",
    timeBudget: "15 分钟",
    material: "今天有 2 个任务、1 个会议和一篇待读文章",
    publishTarget: "微信私聊"
  });

  const fallback = normalizeMobileInput({});
  assert.equal(fallback.product, "AI 个人效率助手");
  assert.equal(fallback.scene, "手机上快速整理");
  assert.equal(fallback.timeBudget, "10 分钟");
});

test("buildTopRecommendations returns three actionable mobile plans", () => {
  const recommendations = buildTopRecommendations({
    domain: "个人效率",
    audience: "产品经理",
    material: "今天有一个需求评审、三条待办和一篇待读文章"
  });

  assert.equal(recommendations.length, 3);
  assert.deepEqual(recommendations.map((recommendation) => recommendation.rank), [1, 2, 3]);
  assert.ok(recommendations[0].title.includes("个人效率"));
  assert.ok(recommendations[0].mobileReason.length > 12);
  assert.ok(recommendations[0].quickAction.length > 12);
  assert.ok(recommendations.every((recommendation) => recommendation.mobileFit === true));
});

test("buildMobileActionPlan compresses a product idea into a phone-sized flow", () => {
  const plan = buildMobileActionPlan({
    domain: "个人效率",
    audience: "独立开发者",
    scene: "通勤路上",
    timeBudget: "8 分钟",
    publishTarget: "微信私聊"
  });

  assert.equal(plan.steps.length, 3);
  assert.equal(plan.recommendations.length, 3);
  assert.ok(plan.mobileConstraints.includes("单屏优先"));
  assert.ok(plan.mobileConstraints.includes("少输入"));
  assert.equal(plan.publishTarget, "微信私聊");
});

test("buildFavoriteRecord stores only local mobile metadata", () => {
  const [recommendation] = buildTopRecommendations({ domain: "轻量记账", audience: "运营" });
  const record = buildFavoriteRecord(recommendation, {
    source: "h5-local",
    note: " 晚上写 "
  });

  assert.equal(record.recommendationId, recommendation.id);
  assert.equal(record.storage, "local-demo");
  assert.equal(record.source, "h5-local");
  assert.equal(record.note, "晚上写");
  assert.equal(Object.hasOwn(record, "openid"), false);
  assert.match(record.savedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("buildShareText creates a compact text that can be copied to chat or notes", () => {
  const plan = buildMobileActionPlan({
    domain: "个人效率",
    audience: "上班族",
    timeBudget: "10 分钟",
    publishTarget: "微信私聊"
  });
  const text = buildShareText(plan);

  assert.ok(text.includes("今日计划"));
  assert.ok(text.includes("个人效率"));
  assert.ok(text.includes("下一步"));
  assert.ok(text.length < 420);
});

test("buildPublishChecklist separates H5 deploy from miniapp submission", () => {
  const h5 = buildPublishChecklist({ route: "h5" });
  const miniapp = buildPublishChecklist({ route: "miniapp" });

  assert.ok(h5.requiredChecks.includes("静态页面可访问"));
  assert.ok(h5.requiredChecks.includes("分享链接可打开"));
  assert.ok(miniapp.requiredChecks.includes("小程序主体和类目"));
  assert.ok(miniapp.requiredChecks.includes("审核材料"));
  assert.ok(miniapp.warnings.includes("本项目当前只交付 H5 形态，小程序提交作为发布路径说明。"));
});

test("buildAiPrompt creates Codex App and CLI prompts for readers building their own product", () => {
  const appPrompt = buildAiPrompt({ surface: "codex-app" });
  const cliPrompt = buildAiPrompt({ surface: "cli" });

  assert.ok(appPrompt.includes("打开 h5-miniapp 项目"));
  assert.ok(appPrompt.includes("从 Web App 压缩到移动端"));
  assert.ok(appPrompt.includes("迁移到自己的产品"));
  assert.ok(cliPrompt.includes("project-vibe-lab/h5-miniapp"));
  assert.ok(cliPrompt.includes("npm test"));
});
