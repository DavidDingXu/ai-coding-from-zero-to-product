import test from "node:test";
import assert from "node:assert/strict";

import { runSmokeTest } from "../src/smoke-runner.js";

test("runSmokeTest returns a dry-run report without calling the network", async () => {
  const result = await runSmokeTest({
    provider: "deepseek",
    env: {
      DEEPSEEK_API_KEY: "sk-deepseek",
      DEEPSEEK_BASE_URL: "https://api.deepseek.com",
      DEEPSEEK_MODEL: "deepseek-v4-pro"
    },
    dryRun: true
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "dry-run");
  assert.equal(result.provider, "deepseek");
  assert.equal(result.endpoint, "https://api.deepseek.com/chat/completions");
  assert.equal(result.apiKey, "sk-d...seek");
});

test("runSmokeTest fails early when API key is missing", async () => {
  await assert.rejects(
    () => runSmokeTest({
      provider: "qwen",
      env: {
        DASHSCOPE_API_KEY: "",
        DASHSCOPE_BASE_URL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        DASHSCOPE_MODEL: "qwen-plus"
      },
      dryRun: false
    }),
    /缺少 DASHSCOPE_API_KEY/
  );
});

test("runSmokeTest sends a chat-completions request to the configured endpoint", async () => {
  const received = [];
  const fetchImpl = async (url, options) => {
    received.push({
      url,
      method: options.method,
      authorization: options.headers.authorization,
      body: JSON.parse(options.body)
    });

    return {
      ok: true,
      status: 200,
      statusText: "OK",
      async text() {
        return JSON.stringify({
        id: "chatcmpl-test",
        object: "chat.completion",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "provider smoke test ok"
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 4,
          total_tokens: 14
        }
        });
      }
    };
  };

  const result = await runSmokeTest({
    provider: "deepseek",
    env: {
      DEEPSEEK_API_KEY: "sk-local",
      DEEPSEEK_BASE_URL: "https://local.test/v1",
      DEEPSEEK_MODEL: "deepseek-v4-pro"
    },
    dryRun: false,
    fetchImpl
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "live");
  assert.equal(result.content, "provider smoke test ok");
  assert.equal(received.length, 1);
  assert.equal(received[0].url, "https://local.test/v1/chat/completions");
  assert.equal(received[0].method, "POST");
  assert.equal(received[0].authorization, "Bearer sk-local");
  assert.equal(received[0].body.model, "deepseek-v4-pro");
  assert.equal(received[0].body.stream, false);
});
