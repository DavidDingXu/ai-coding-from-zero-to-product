import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLandingBrief,
  buildLandingCopy,
  buildFeedbackRecord,
  validateWaitlistInput,
  buildLaunchChecklist,
  buildAiPrompt
} from "../src/landing-page.js";

test("buildLandingBrief keeps the first landing page scope small", () => {
  const brief = buildLandingBrief();

  assert.equal(brief.productName, "AI 个人效率助手");
  assert.equal(brief.pageGoal, "解释产品价值，并收集第一批候补用户反馈。");
  assert.ok(brief.primaryAudience.includes("学生"));
  assert.ok(brief.primaryAudience.includes("上班族"));
  assert.ok(brief.inScope.includes("候补表单"));
  assert.ok(brief.outOfScope.includes("登录和账号体系"));
  assert.ok(brief.outOfScope.includes("真实模型调用"));
});

test("buildLandingCopy creates page sections that match the first product promise", () => {
  const copy = buildLandingCopy();

  assert.equal(copy.hero.title, "把任务、日程、笔记和账目整理成今天能执行的计划");
  assert.ok(copy.hero.subtitle.includes("今日计划"));
  assert.equal(copy.valueCards.length, 3);
  assert.equal(copy.steps.length, 3);
  assert.equal(copy.waitlist.cta, "加入候补名单");
  assert.ok(copy.proofPoints.includes("第一版先做官网和候补表单"));
});

test("validateWaitlistInput accepts a complete waitlist form", () => {
  const result = validateWaitlistInput({
    name: "Ding",
    email: "ding@example.com",
    role: "运营",
    scenario: "个人效率",
    pain: "任务、日程和笔记分散，今天该先做什么经常不清楚。"
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("validateWaitlistInput rejects incomplete or risky input", () => {
  const result = validateWaitlistInput({
    name: "",
    email: "bad-email",
    role: "",
    scenario: "AI 编程",
    pain: "sk-real-secret"
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, [
    "请填写称呼。",
    "请填写可联系的邮箱。",
    "请说明你的角色。",
    "不要在反馈里填写 API Key、密码或其他密钥。"
  ]);
});

test("buildFeedbackRecord normalizes user input without pretending it is stored remotely", () => {
  const record = buildFeedbackRecord({
    name: "  Ding  ",
    email: "DING@EXAMPLE.COM ",
    role: " 独立开发者 ",
    scenario: " 个人效率 ",
    pain: " 想把任务和笔记整理成今日计划 "
  });

  assert.equal(record.storage, "local-demo");
  assert.equal(record.name, "Ding");
  assert.equal(record.email, "ding@example.com");
  assert.equal(record.role, "独立开发者");
  assert.equal(record.scenario, "个人效率");
  assert.equal(record.pain, "想把任务和笔记整理成今日计划");
});

test("buildLaunchChecklist separates page, form, privacy and verification checks", () => {
  const checklist = buildLaunchChecklist();
  const ids = checklist.map((item) => item.id);

  assert.deepEqual(ids, [
    "page-message",
    "form-validation",
    "privacy-boundary",
    "local-verification",
    "next-step"
  ]);
  assert.ok(checklist.every((item) => item.done === false));
});

test("buildAiPrompt creates Codex App and CLI friendly prompts", () => {
  const appPrompt = buildAiPrompt({ surface: "codex-app" });
  const cliPrompt = buildAiPrompt({ surface: "cli" });

  assert.ok(appPrompt.includes("打开 web-landing 项目"));
  assert.ok(appPrompt.includes("先读 README.md 和 process/02-spec.md"));
  assert.ok(cliPrompt.includes("npm test"));
  assert.ok(cliPrompt.includes("不要接入真实模型、登录、真实提醒、支付或远程数据库"));
});
