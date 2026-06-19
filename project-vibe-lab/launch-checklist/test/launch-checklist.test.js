import test from "node:test";
import assert from "node:assert/strict";
import {
  LAUNCH_GATES,
  auditRelease,
  buildAiPrompt,
  buildEvidenceTemplate,
  buildLaunchBrief,
  buildReleasePlan,
  buildRollbackPlan,
  listGates
} from "../src/launch-checklist.js";

const ALL_EVIDENCE = LAUNCH_GATES.flatMap((gate) => gate.evidence);

test("brief keeps launch checklist as pre-release audit not real deployment", () => {
  const brief = buildLaunchBrief();

  assert.equal(brief.project, "launch-checklist");
  assert.equal(brief.gates, 7);
  assert.ok(brief.outOfScope.includes("不做真实部署"));
  assert.ok(brief.outOfScope.includes("不接真实支付"));
});

test("lists seven gates with owners and evidence", () => {
  const gates = listGates();

  assert.equal(gates.length, 7);
  assert.deepEqual(gates.map((gate) => gate.id), [
    "scope",
    "permission",
    "privacy",
    "cost",
    "observability",
    "deployment",
    "rollback"
  ]);
  assert.ok(gates.every((gate) => gate.evidence.length >= 3));
});

test("audit blocks release when permission privacy cost or rollback evidence is missing", () => {
  const audit = auditRelease({
    evidence: ["release-scope", "disabled-features", "known-limits"]
  });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.mustFix.includes("permission"));
  assert.ok(audit.mustFix.includes("privacy"));
  assert.ok(audit.mustFix.includes("rollback"));
});

test("audit allows small release only when all evidence is present", () => {
  const audit = auditRelease({ evidence: ALL_EVIDENCE });

  assert.equal(audit.status, "ready-for-small-release");
  assert.equal(audit.mustFix.length, 0);
  assert.ok(audit.gateResults.every((gate) => gate.status === "pass"));
});

test("release plan requires fixing blocked gates before publishing", () => {
  const plan = buildReleasePlan({
    evidence: ["release-scope", "disabled-features", "known-limits"]
  });

  assert.equal(plan.status, "blocked");
  assert.match(plan.steps[0], /补齐/);
  assert.ok(plan.blockedGates.includes("deployment"));
});

test("release plan includes smoke test and rollback window when ready", () => {
  const plan = buildReleasePlan({ evidence: ALL_EVIDENCE });

  assert.equal(plan.status, "ready-for-small-release");
  assert.ok(plan.steps.some((step) => step.includes("smoke test")));
  assert.ok(plan.steps.some((step) => step.includes("回滚窗口")));
});

test("rollback plan contains concrete triggers actions and evidence", () => {
  const rollback = buildRollbackPlan();

  assert.ok(rollback.trigger.some((item) => item.includes("越权")));
  assert.ok(rollback.actions.some((item) => item.includes("feature switch")));
  assert.ok(rollback.evidence.includes("rollback-command"));
});

test("evidence template maps every gate to file or command locations", () => {
  const template = buildEvidenceTemplate();

  assert.equal(template.length, 7);
  assert.ok(template.some((item) => item.gate === "deployment"));
  assert.ok(template.flatMap((item) => item.evidence).every((item) => item.fileOrCommand));
});

test("AI prompt asks for audit before deployment", () => {
  const prompt = buildAiPrompt({ product: "简历优化器" });

  assert.match(prompt, /简历优化器/);
  assert.match(prompt, /上线前 7 道闸审查/);
  assert.match(prompt, /不要直接部署/);
  assert.match(prompt, /不要接真实支付/);
});
