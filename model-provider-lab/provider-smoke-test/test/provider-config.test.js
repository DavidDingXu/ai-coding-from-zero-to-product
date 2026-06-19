import test from "node:test";
import assert from "node:assert/strict";

import {
  buildChatCompletionRequest,
  getProviderConfig,
  listProviderCompatibility,
  maskSecret,
  normalizeChatCompletionsUrl
} from "../src/provider-config.js";

test("getProviderConfig returns current DeepSeek defaults", () => {
  const config = getProviderConfig("deepseek", {
    DEEPSEEK_API_KEY: "sk-deepseek",
    DEEPSEEK_BASE_URL: "",
    DEEPSEEK_MODEL: ""
  });

  assert.equal(config.provider, "deepseek");
  assert.equal(config.baseUrl, "https://api.deepseek.com");
  assert.equal(config.model, "deepseek-v4-pro");
  assert.equal(config.apiKey, "sk-deepseek");
  assert.equal(config.requestApi, "chat_completions");
});

test("getProviderConfig returns DashScope compatible-mode defaults for Qwen", () => {
  const config = getProviderConfig("qwen", {
    DASHSCOPE_API_KEY: "sk-dashscope",
    DASHSCOPE_BASE_URL: "",
    DASHSCOPE_MODEL: ""
  });

  assert.equal(config.provider, "qwen");
  assert.equal(config.baseUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1");
  assert.equal(config.model, "qwen-plus");
  assert.equal(config.apiKey, "sk-dashscope");
  assert.equal(config.requestApi, "chat_completions");
});

test("normalizeChatCompletionsUrl appends chat endpoint without double slashes", () => {
  assert.equal(
    normalizeChatCompletionsUrl("https://api.deepseek.com"),
    "https://api.deepseek.com/chat/completions"
  );
  assert.equal(
    normalizeChatCompletionsUrl("https://dashscope.aliyuncs.com/compatible-mode/v1/"),
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
  );
});

test("buildChatCompletionRequest creates a minimal OpenAI-compatible request", () => {
  const request = buildChatCompletionRequest({
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com",
    apiKey: "sk-test",
    model: "deepseek-v4-pro",
    requestApi: "chat_completions"
  });

  assert.equal(request.url, "https://api.deepseek.com/chat/completions");
  assert.equal(request.method, "POST");
  assert.equal(request.headers.authorization, "Bearer sk-test");
  assert.deepEqual(request.body.messages, [
    { role: "system", content: "You are a concise coding assistant." },
    { role: "user", content: "Reply with exactly: provider smoke test ok" }
  ]);
  assert.equal(request.body.model, "deepseek-v4-pro");
  assert.equal(request.body.stream, false);
});

test("maskSecret keeps enough information for debugging without leaking the key", () => {
  assert.equal(maskSecret("sk-1234567890"), "sk-1...7890");
  assert.equal(maskSecret("short"), "*****");
  assert.equal(maskSecret(""), "");
});

test("listProviderCompatibility explains the three verification layers", () => {
  const matrix = listProviderCompatibility();

  assert.equal(matrix.providers.length, 2);
  assert.equal(matrix.layers.length, 3);
  assert.equal(matrix.layers[0].id, "minimal-chat-call");
  assert.match(matrix.layers[1].doesNotProve, /真实项目/);
  assert.equal(
    matrix.providers.find((item) => item.provider === "qwen").responsesApi,
    "available_in_dashscope_docs_but_not_called_by_this_demo"
  );
});
