import test from "node:test";
import assert from "node:assert/strict";

import {
  buildQwenRequest,
  classifyQwenBaseUrl,
  getQwenConfig,
  normalizeQwenEndpoint
} from "../src/qwen-config.js";

test("uses DashScope Beijing compatible-mode defaults", () => {
  const config = getQwenConfig({
    DASHSCOPE_API_KEY: "sk-dashscope",
    DASHSCOPE_BASE_URL: "",
    DASHSCOPE_MODEL: ""
  });

  assert.equal(config.apiKey, "sk-dashscope");
  assert.equal(config.apiKeyEnv, "DASHSCOPE_API_KEY");
  assert.equal(config.baseUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1");
  assert.equal(config.model, "qwen-plus");
});

test("falls back to BAILIAN_API_KEY when DASHSCOPE_API_KEY is missing", () => {
  const config = getQwenConfig({
    BAILIAN_API_KEY: "sk-bailian"
  });

  assert.equal(config.apiKey, "sk-bailian");
  assert.equal(config.apiKeyEnv, "BAILIAN_API_KEY");
});

test("normalizes chat completions endpoint without duplicate slashes", () => {
  assert.equal(
    normalizeQwenEndpoint("https://dashscope.aliyuncs.com/compatible-mode/v1/"),
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
  );
});

test("classifies Beijing compatible-mode and custom base URLs", () => {
  assert.deepEqual(
    classifyQwenBaseUrl("https://dashscope.aliyuncs.com/compatible-mode/v1"),
    {
      kind: "dashscope-compatible-beijing",
      ok: true,
      region: "cn-beijing",
      message: "这是百炼北京地域 OpenAI 兼容模式地址，适合本模块默认 smoke test。"
    }
  );

  const custom = classifyQwenBaseUrl("https://example.com/compatible-mode/v1");
  assert.equal(custom.kind, "custom-compatible");
  assert.equal(custom.ok, true);
  assert.match(custom.message, /默认只讲百炼北京地域/);
});

test("flags Qwen Code Coding Plan base URL as a different route", () => {
  const result = classifyQwenBaseUrl("https://coding.dashscope.aliyuncs.com/v1");

  assert.equal(result.ok, false);
  assert.equal(result.kind, "qwen-code-coding-plan");
  assert.match(result.message, /Coding Plan/);
});

test("builds a minimal non-stream OpenAI-compatible request", () => {
  const request = buildQwenRequest({
    apiKey: "sk-test",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    enableThinking: true
  });

  assert.equal(request.url, "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");
  assert.equal(request.method, "POST");
  assert.equal(request.headers.authorization, "Bearer sk-test");
  assert.equal(request.body.model, "qwen-plus");
  assert.equal(request.body.stream, false);
  assert.equal(request.body.enable_thinking, true);
  assert.deepEqual(Object.keys(request.body).sort(), ["enable_thinking", "messages", "model", "stream"]);
});
