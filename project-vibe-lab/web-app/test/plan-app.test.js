import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAppBrief,
  buildAiPrompt,
  buildLaunchChecklist,
  buildSavedActionCardRecord,
  buildPlanPrompt,
  filterActionCards,
  generateActionCards,
  normalizePlanInput
} from "../src/plan-app.js";

test("buildAppBrief keeps web-app focused on daily planning and local saving", () => {
  const brief = buildAppBrief();

  assert.equal(brief.productName, "AI 个人效率助手");
  assert.equal(brief.projectId, "web-app");
  assert.ok(brief.inScope.includes("记录任务、日程、笔记和账目"));
  assert.ok(brief.inScope.includes("生成今日计划"));
  assert.ok(brief.inScope.includes("按类型和优先级筛选"));
  assert.ok(brief.outOfScope.includes("真实模型调用"));
  assert.ok(brief.outOfScope.includes("账号体系和远程数据库"));
});

test("normalizePlanInput trims input and applies daily planning defaults", () => {
  const input = normalizePlanInput({
    domain: " 工作和学习 ",
    audience: " 上班族 ",
    goal: " 今天先完成关键任务 ",
    tone: " 今日计划 ",
    constraints: " 不接真实提醒 "
  });

  assert.deepEqual(input, {
    domain: "工作和学习",
    audience: "上班族",
    goal: "今天先完成关键任务",
    tone: "今日计划",
    constraints: "不接真实提醒"
  });

  const fallback = normalizePlanInput({});
  assert.equal(fallback.domain, "工作和学习");
  assert.equal(fallback.audience, "想提升效率的普通用户");
  assert.equal(fallback.goal, "整理今天最该完成的 3 件事");
});

test("generateActionCards creates ten ranked planning cards with reasons and next actions", () => {
  const cards = generateActionCards({
    domain: "工作和学习",
    audience: "上班族",
    goal: "今天先完成关键任务",
    tone: "今日计划",
    constraints: "不接真实提醒"
  });

  assert.equal(cards.length, 10);
  assert.deepEqual(
    cards.map((card) => card.rank),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );
  assert.ok(cards[0].title.includes("工作和学习"));
  assert.ok(cards[0].audience.includes("上班族"));
  assert.ok(cards[0].reason.length > 12);
  assert.ok(cards[0].nextAction.length > 12);
  assert.ok(cards.every((card) => ["easy", "medium", "hard"].includes(card.difficulty)));
});

test("filterActionCards supports difficulty, type and stage filters without mutating input", () => {
  const cards = generateActionCards({ domain: "个人效率", audience: "独立开发者" });
  const snapshot = cards.map((card) => card.id);

  const easyTasks = filterActionCards(cards, {
    difficulty: "easy",
    type: "task"
  });
  const decisionStage = filterActionCards(cards, {
    stage: "decision"
  });

  assert.ok(easyTasks.length >= 1);
  assert.ok(easyTasks.every((card) => card.difficulty === "easy"));
  assert.ok(easyTasks.every((card) => card.type === "task"));
  assert.ok(decisionStage.every((card) => card.stage === "decision"));
  assert.deepEqual(cards.map((card) => card.id), snapshot);
});

test("buildSavedActionCardRecord stores only safe local metadata", () => {
  const [card] = generateActionCards({ domain: "个人效率", audience: "运营" });
  const record = buildSavedActionCardRecord(card, {
    source: "browser-local",
    note: " 准备本周三写 "
  });

  assert.equal(record.cardId, card.id);
  assert.equal(record.storage, "local-demo");
  assert.equal(record.source, "browser-local");
  assert.equal(record.note, "准备本周三写");
  assert.match(record.savedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(Object.hasOwn(record, "apiKey"), false);
});

test("buildPlanPrompt creates App and CLI friendly prompts for the same flow", () => {
  const prompt = buildPlanPrompt({
    domain: "个人效率",
    audience: "产品经理",
    goal: "整理今日计划"
  });

  assert.ok(prompt.includes("个人效率"));
  assert.ok(prompt.includes("产品经理"));
  assert.ok(prompt.includes("今日计划"));
  assert.ok(prompt.includes("不要接入真实模型"));
});

test("buildLaunchChecklist and buildAiPrompt guide verification before expansion", () => {
  const checklist = buildLaunchChecklist();
  const prompt = buildAiPrompt({ surface: "cli" });

  assert.deepEqual(
    checklist.map((item) => item.id),
    [
      "plan-generation",
      "plan-filtering",
      "copy-and-save",
      "privacy-boundary",
      "local-verification"
    ]
  );
  assert.ok(checklist.every((item) => item.done === false));
  assert.ok(prompt.includes("project-vibe-lab/web-app"));
  assert.ok(prompt.includes("npm test"));
});
