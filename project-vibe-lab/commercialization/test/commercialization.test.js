import test from "node:test";
import assert from "node:assert/strict";
import {
  COMMERCIALIZATION_EVIDENCE,
  auditCommercialization,
  buildAiPrompt,
  buildCommercializationBrief,
  buildCommercializationChecklist,
  buildMockInvoice,
  calculateMeter,
  listPlans,
  summarizeUsage
} from "../src/commercialization.js";

test("brief keeps commercialization before real payment integration", () => {
  const brief = buildCommercializationBrief();

  assert.equal(brief.article, 25);
  assert.ok(brief.outOfScope.includes("不接真实支付"));
  assert.ok(brief.outOfScope.includes("不保存真实支付密钥"));
});

test("plans define price quota features and limits", () => {
  const plans = listPlans();

  assert.deepEqual(plans.map((plan) => plan.id), ["free", "pro", "team"]);
  assert.ok(plans.every((plan) => Number.isFinite(plan.priceCny)));
  assert.ok(plans.every((plan) => plan.monthlyQuota > 0));
  assert.ok(plans.every((plan) => plan.limits.length > 0));
});

test("usage summary calculates total tokens quota left and quota status", () => {
  const usage = summarizeUsage({
    usage: [{ userId: "u1", planId: "free", action: "plan_generate", inputTokens: 1000, outputTokens: 2000, count: 22 }]
  });

  assert.equal(usage[0].totalTokens, 3000);
  assert.equal(usage[0].quotaLeft, 0);
  assert.equal(usage[0].quotaStatus, "over-quota");
});

test("meter calculates model cost and gross margin", () => {
  const meter = calculateMeter({
    costPer1kTokensCny: 0.02,
    usage: [{ userId: "u1", planId: "pro", action: "plan_generate", inputTokens: 1000, outputTokens: 9000, count: 10 }]
  });

  assert.equal(meter[0].modelCostCny, 0.2);
  assert.equal(meter[0].planPriceCny, 19);
  assert.equal(meter[0].grossMarginCny, 18.8);
});

test("mock invoice stays draft and clearly non-real payment", () => {
  const invoice = buildMockInvoice({ planId: "team" });

  assert.equal(invoice.status, "draft");
  assert.equal(invoice.paymentProvider, "mock");
  assert.match(invoice.note, /模拟账单/);
});

test("audit blocks before payment sandbox when refund or privacy evidence is missing", () => {
  const audit = auditCommercialization({
    evidence: ["account-id", "plan-definition", "quota-policy", "usage-meter", "cost-model"]
  });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.missing.includes("payment-boundary"));
  assert.ok(audit.missing.includes("refund-policy"));
  assert.ok(audit.missing.includes("privacy-copy"));
});

test("audit allows payment sandbox only when every evidence item exists", () => {
  const audit = auditCommercialization({ evidence: COMMERCIALIZATION_EVIDENCE });

  assert.equal(audit.status, "ready-for-payment-sandbox");
  assert.equal(audit.missing.length, 0);
});

test("commercialization checklist covers account plan meter overage and payment", () => {
  const checklist = buildCommercializationChecklist();

  assert.deepEqual(checklist.map((item) => item.id), ["account", "plan", "meter", "overage", "payment"]);
  assert.ok(checklist.every((item) => item.evidence.length >= 1));
});

test("AI prompt asks for commercial audit without real payment key", () => {
  const prompt = buildAiPrompt({ product: "简历优化器" });

  assert.match(prompt, /简历优化器/);
  assert.match(prompt, /商业化前置审查/);
  assert.match(prompt, /不要接真实支付/);
  assert.match(prompt, /不要写入支付密钥/);
});
