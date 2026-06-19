import test from "node:test";
import assert from "node:assert/strict";

import { buildBrief } from "../src/brief-builder.js";

test("buildBrief turns a raw product idea into an AI-coding-ready brief", () => {
  const result = buildBrief({
    idea: "做一个给上班族用的个人效率计划工具",
    audience: "上班族",
    coreFeatures: "记录任务和日程，按优先级排序，标记完成状态",
    style: "清爽，适合长时间使用",
    constraints: "先做本地单页版本，不接后端"
  });

  assert.equal(result.title, "上班族个人效率计划工具");
  assert.match(result.brief, /目标用户：上班族/);
  assert.match(result.brief, /核心功能：记录任务和日程，按优先级排序，标记完成状态/);
  assert.match(result.brief, /限制条件：先做本地单页版本，不接后端/);
  assert.match(result.prompt, /你是资深产品工程师和前端工程师/);
  assert.match(result.prompt, /我要用 AI 编程工具做一个小产品/);
  assert.match(result.prompt, /请先澄清需求，再生成实现计划/);
  assert.match(result.prompt, /完成后必须说明如何运行和验证/);
  assert.doesNotMatch(result.prompt, /交给 Codex/);
});

test("buildBrief rejects an empty product idea", () => {
  assert.throws(
    () => buildBrief({ idea: "   " }),
    /产品想法不能为空/
  );
});
