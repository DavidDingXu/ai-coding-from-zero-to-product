import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDeepSeekRequest,
  getDeepSeekConfig,
  normalizeDeepSeekEndpoint,
  validateDeepSeekModel
} from "../src/deepseek-config.js";

test("uses current DeepSeek defaults from official API docs", () => {
  const config = getDeepSeekConfig({
    DEEPSEEK_API_KEY: "sk-test",
    DEEPSEEK_BASE_URL: "",
    DEEPSEEK_MODEL: ""
  });

  assert.equal(config.baseUrl, "https://api.deepseek.com");
  assert.equal(config.model, "deepseek-v4-pro");
  assert.equal(config.apiKey, "sk-test");
});

test("normalizes chat completions endpoint without duplicate slashes", () => {
  assert.equal(
    normalizeDeepSeekEndpoint("https://api.deepseek.com/"),
    "https://api.deepseek.com/chat/completions"
  );
});

test("warns for deprecated legacy DeepSeek model names", () => {
  const result = validateDeepSeekModel("deepseek-chat");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "legacy-model-deprecated");
  assert.match(result.message, /2026\/07\/24/);
  assert.equal(result.suggestedModel, "deepseek-v4-flash");
});

test("accepts current DeepSeek V4 models", () => {
  assert.equal(validateDeepSeekModel("deepseek-v4-pro").ok, true);
  assert.equal(validateDeepSeekModel("deepseek-v4-flash").ok, true);
});

test("builds a minimal non-stream chat completions request", () => {
  const request = buildDeepSeekRequest({
    apiKey: "sk-test",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-pro",
    thinking: "enabled",
    reasoningEffort: "high"
  });

  assert.equal(request.url, "https://api.deepseek.com/chat/completions");
  assert.equal(request.method, "POST");
  assert.equal(request.headers.authorization, "Bearer sk-test");
  assert.equal(request.body.model, "deepseek-v4-pro");
  assert.equal(request.body.stream, false);
  assert.deepEqual(request.body.thinking, { type: "enabled" });
  assert.equal(request.body.reasoning_effort, "high");
});
