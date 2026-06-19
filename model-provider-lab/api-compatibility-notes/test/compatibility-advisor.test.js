import test from "node:test";
import assert from "node:assert/strict";

import {
  assessProviderCompatibility,
  compareWireApis,
  listCompatibilityChecks
} from "../src/compatibility-advisor.js";

test("marks chat-completions providers as plain API smoke tests", () => {
  const result = assessProviderCompatibility({
    provider: "deepseek",
    supportsChatCompletions: true,
    supportsResponsesApi: false,
    supportsStreaming: true,
    supportsToolCalling: false
  });

  assert.equal(result.level, "chat-smoke-only");
  assert.equal(result.longTermRisk, "high");
  assert.equal(result.canProveCodexStable, false);
  assert.match(result.message, /Chat Completions/);
  assert.match(result.message, /普通接口练习/);
  assert.match(result.message, /不是 Codex provider/);
});

test("marks responses-capable providers as Codex candidates that still need project proof", () => {
  const result = assessProviderCompatibility({
    provider: "proxy",
    supportsChatCompletions: true,
    supportsResponsesApi: true,
    supportsStreaming: true,
    supportsToolCalling: true
  });

  assert.equal(result.level, "responses-codex-candidate");
  assert.equal(result.longTermRisk, "medium");
  assert.equal(result.canProveCodexStable, false);
  assert.match(result.nextChecks.join("\n"), /真实项目/);
});

test("does not treat plain chat as coding workflow proof", () => {
  const result = assessProviderCompatibility({
    provider: "chat-only",
    supportsChatCompletions: true,
    supportsResponsesApi: false,
    supportsStreaming: false,
    supportsToolCalling: false
  });

  assert.equal(result.level, "chat-only-smoke-test");
  assert.equal(result.canProveCodexStable, false);
});

test("compares Chat Completions and Responses API capability boundaries", () => {
  const rows = compareWireApis();
  const chat = rows.find((row) => row.api === "chat_completions");
  const responses = rows.find((row) => row.api === "responses");

  assert.equal(chat.generalApiStatus, "supported");
  assert.equal(chat.codexProviderFit, "not-a-codex-provider-proof");
  assert.equal(responses.generalApiStatus, "recommended-for-new-projects");
  assert.equal(responses.codexProviderFit, "codex-provider-candidate");
});

test("lists checks from minimal call to real project workflow", () => {
  assert.deepEqual(listCompatibilityChecks(), [
    "最小 Chat Completions 调用",
    "Responses API 支持",
    "按当前 Codex 配置参考核对 wire_api",
    "流式输出",
    "工具调用或等价机制",
    "长上下文与上下文压缩",
    "真实项目改代码、跑测试、浏览器验证"
  ]);
});
