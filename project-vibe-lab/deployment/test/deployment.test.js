import test from "node:test";
import assert from "node:assert/strict";
import {
  DEPLOYMENT_EVIDENCE,
  auditDeployment,
  buildAiPrompt,
  buildDeploymentBrief,
  buildDeploymentRunbook,
  buildEvidenceTemplate,
  buildPlatformCommands,
  buildRollbackPlan,
  buildSmokePlan,
  choosePlatform,
  listPlatforms
} from "../src/deployment.js";

test("brief keeps deployment demo away from real cloud publishing", () => {
  const brief = buildDeploymentBrief();

  assert.equal(brief.article, 24);
  assert.ok(brief.outOfScope.includes("不写入真实 token"));
  assert.ok(brief.outOfScope.includes("不直接发布生产环境"));
});

test("lists platform choices with avoid conditions", () => {
  const platforms = listPlatforms();

  assert.equal(platforms.length, 3);
  assert.deepEqual(platforms.map((item) => item.id), [
    "cloudbase-static",
    "edgeone-pages",
    "light-backend"
  ]);
  assert.ok(platforms.every((item) => item.bestFor && item.avoidWhen));
});

test("chooses light backend when product needs login database or model proxy", () => {
  const platform = choosePlatform({ needs: ["model-proxy", "database"], region: "domestic" });

  assert.equal(platform.id, "light-backend");
});

test("chooses CloudBase for domestic static or miniapp route", () => {
  const platform = choosePlatform({ needs: ["miniapp"], region: "domestic" });

  assert.equal(platform.id, "cloudbase-static");
});

test("chooses CloudBase for domestic static route by default", () => {
  const platform = choosePlatform({ needs: ["static"] });

  assert.equal(platform.id, "cloudbase-static");
});

test("runbook includes preview health smoke and rollback gates", () => {
  const runbook = buildDeploymentRunbook({ needs: ["static"] });

  assert.equal(runbook.platform, "cloudbase-static");
  assert.ok(runbook.steps.some((step) => step.includes("preview")));
  assert.ok(runbook.steps.some((step) => step.includes("smoke-test")));
  assert.ok(runbook.stopRules.includes("没有 rollback-command"));
});

test("platform commands expose docs and manual confirmation", () => {
  const commands = buildPlatformCommands("edgeone-pages");

  assert.match(commands.preview, /preview/);
  assert.match(commands.env, /env/);
  assert.ok(commands.docs.some((doc) => doc.includes("edgeone")));
  assert.ok(commands.manualConfirm.length >= 3);
});

test("audit blocks deployment when rollback evidence is missing", () => {
  const audit = auditDeployment({
    evidence: ["release-scope", "build-command", "output-dir", "env-list", "preview-url"]
  });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.missing.includes("rollback-command"));
  assert.ok(audit.missing.includes("smoke-test"));
});

test("audit allows small release only when every evidence item exists", () => {
  const audit = auditDeployment({ evidence: DEPLOYMENT_EVIDENCE });

  assert.equal(audit.status, "ready-for-small-release");
  assert.equal(audit.missing.length, 0);
});

test("evidence template maps every evidence item to file or command", () => {
  const template = buildEvidenceTemplate();

  assert.equal(template.length, DEPLOYMENT_EVIDENCE.length);
  assert.ok(template.every((item) => item.fileOrCommand));
});

test("smoke plan checks main path and error path", () => {
  const plan = buildSmokePlan({ url: "preview.example.com" });

  assert.equal(plan.url, "https://preview.example.com");
  assert.ok(plan.checks.some((check) => check.id === "submit-main-form"));
  assert.ok(plan.checks.some((check) => check.id === "error-path"));
});

test("rollback plan has trigger command and actions", () => {
  const rollback = buildRollbackPlan("cloudbase-static");

  assert.match(rollback.command, /上一版 dist/);
  assert.ok(rollback.actions.some((item) => item.includes("feature switch")));
});

test("AI prompt asks for plan without cloud login or real token", () => {
  const prompt = buildAiPrompt({ product: "简历优化器", needs: ["model-proxy"] });

  assert.match(prompt, /简历优化器/);
  assert.match(prompt, /部署 runbook/);
  assert.match(prompt, /不要替我登录云平台/);
  assert.match(prompt, /不要写入真实 token/);
});
