import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLearningPath,
  buildStarterPrompt,
  getVisibleProductStages
} from "../src/playground.js";

test("learning path starts from visible product outcomes instead of tests", () => {
  const path = buildLearningPath({
    idea: "给独立开发者做一个客户需求整理工具",
    audience: "独立开发者"
  });

  assert.equal(path.idea, "给独立开发者做一个客户需求整理工具");
  assert.ok(path.summary.includes("先看到页面"));
  assert.ok(path.stages.length >= 6);
  assert.equal(path.stages[0].primaryAction.kind, "open-page");
  assert.ok(path.stages[0].visibleResult.includes("页面"));
  assert.ok(path.stages.every((stage) => !stage.visibleResult.includes("npm test")));
});

test("visible stages map to runnable companion modules", () => {
  const stages = getVisibleProductStages();

  assert.deepEqual(
    stages.map((stage) => stage.id),
    ["first-page", "landing", "web-app", "h5", "extension", "backend", "launch"]
  );
  assert.ok(stages.every((stage) => stage.modulePath));
  assert.ok(stages.some((stage) => stage.previewUrl?.includes("5175")));
});

test("starter prompt keeps Codex focused on product experience and verification evidence", () => {
  const prompt = buildStarterPrompt("project-vibe-lab/web-app");

  assert.ok(prompt.includes("先打开页面"));
  assert.ok(prompt.includes("再运行验证命令"));
  assert.ok(prompt.includes("不要只告诉我测试通过"));
});
