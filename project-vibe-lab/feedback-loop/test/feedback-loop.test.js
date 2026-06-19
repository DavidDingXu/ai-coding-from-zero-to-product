import test from "node:test";
import assert from "node:assert/strict";
import {
  FEEDBACK_LOOP_EVIDENCE,
  SAMPLE_FEEDBACK,
  auditFeedbackLoop,
  buildAiPrompt,
  buildFeedbackBrief,
  buildFeedbackChecklist,
  buildSpecFromFeedback,
  buildTaskQueue,
  classifyFeedback,
  extractFeedbackFacts,
  normalizeFeedbackInbox
} from "../src/feedbackLoop.js";

test("brief keeps feedback loop focused on evidence-backed iteration", () => {
  const brief = buildFeedbackBrief();

  assert.equal(brief.article, 26);
  assert.ok(brief.goal.includes("反馈"));
  assert.ok(brief.outOfScope.includes("不把单条反馈直接当需求"));
});

test("inbox normalizes raw feedback without losing source and channel", () => {
  const inbox = normalizeFeedbackInbox(SAMPLE_FEEDBACK);

  assert.equal(inbox.length, 5);
  assert.ok(inbox.every((item) => item.id && item.channel && item.rawText));
  assert.ok(inbox.every((item) => item.receivedAt));
});

test("classification separates bug usability trust commercial and feature request", () => {
  const classified = classifyFeedback(SAMPLE_FEEDBACK);

  assert.deepEqual(classified.map((item) => item.type), ["usability", "trust", "commercial", "bug", "feature-request"]);
  assert.equal(classified[0].severity, 5);
});

test("fact extraction separates facts judgments and assumptions", () => {
  const facts = extractFeedbackFacts(SAMPLE_FEEDBACK);

  assert.ok(facts.some((item) => item.fact.includes("找不到保存入口")));
  assert.ok(facts.every((item) => item.fact && item.judgment && item.assumption));
  assert.ok(facts.every((item) => item.needsEvidence.length > 0));
});

test("spec from feedback has problem scope acceptance and non goals", () => {
  const spec = buildSpecFromFeedback(SAMPLE_FEEDBACK);

  assert.equal(spec.title, "让用户更容易保存和带走生成结果");
  assert.ok(spec.problem.includes("保存入口"));
  assert.ok(spec.acceptanceCriteria.some((item) => item.includes("保存按钮")));
  assert.ok(spec.nonGoals.includes("不新增团队空间"));
});

test("task queue is small ordered and tied to verification", () => {
  const tasks = buildTaskQueue(SAMPLE_FEEDBACK);

  assert.deepEqual(tasks.map((task) => task.id), ["save-entry", "copy-format", "privacy-hint", "payment-copy"]);
  assert.ok(tasks.every((task) => task.verification.length > 0));
  assert.ok(tasks.every((task) => task.prompt.includes("不要扩大范围")));
});

test("audit blocks before feedback evidence is complete", () => {
  const audit = auditFeedbackLoop({
    evidence: ["raw-feedback", "classification", "fact-extraction"]
  });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.missing.includes("spec-update"));
  assert.ok(audit.missing.includes("verification-plan"));
});

test("audit allows next iteration when all feedback evidence exists", () => {
  const audit = auditFeedbackLoop({ evidence: FEEDBACK_LOOP_EVIDENCE });

  assert.equal(audit.status, "ready-for-next-iteration");
  assert.equal(audit.missing.length, 0);
});

test("checklist covers capture classify spec tasks verification and reply", () => {
  const checklist = buildFeedbackChecklist();

  assert.deepEqual(checklist.map((item) => item.id), ["capture", "classify", "spec", "tasks", "verify", "reply"]);
  assert.ok(checklist.every((item) => item.evidence.length >= 1));
});

test("AI prompt asks to turn feedback into tasks without blindly changing code", () => {
  const prompt = buildAiPrompt({ product: "AI 个人效率助手" });

  assert.match(prompt, /AI 个人效率助手/);
  assert.match(prompt, /反馈/);
  assert.match(prompt, /spec/);
  assert.match(prompt, /不要直接改代码/);
});
