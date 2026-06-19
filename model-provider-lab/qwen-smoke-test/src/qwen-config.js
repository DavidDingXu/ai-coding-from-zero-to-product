const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const DEFAULT_MODEL = "qwen-plus";

export function getQwenConfig(env = process.env) {
  const dashscopeKey = readEnv(env, "DASHSCOPE_API_KEY");
  const bailianKey = readEnv(env, "BAILIAN_API_KEY");

  return {
    apiKey: dashscopeKey || bailianKey,
    apiKeyEnv: dashscopeKey || !bailianKey ? "DASHSCOPE_API_KEY" : "BAILIAN_API_KEY",
    baseUrl: readEnv(env, "DASHSCOPE_BASE_URL") || readEnv(env, "BAILIAN_BASE_URL") || DEFAULT_BASE_URL,
    model: readEnv(env, "DASHSCOPE_MODEL") || readEnv(env, "BAILIAN_MODEL") || DEFAULT_MODEL,
    enableThinking: parseBoolean(readEnv(env, "DASHSCOPE_ENABLE_THINKING"), true)
  };
}

export function normalizeQwenEndpoint(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, "")}/chat/completions`;
}

export function classifyQwenBaseUrl(baseUrl) {
  const normalized = String(baseUrl || "").replace(/\/+$/, "");

  if (normalized === "https://dashscope.aliyuncs.com/compatible-mode/v1") {
    return {
      kind: "dashscope-compatible-beijing",
      ok: true,
      region: "cn-beijing",
      message: "这是百炼北京地域 OpenAI 兼容模式地址，适合本模块默认 smoke test。"
    };
  }

  if (normalized.includes("coding.dashscope.aliyuncs.com")) {
    return {
      kind: "qwen-code-coding-plan",
      ok: false,
      region: "qwen-code",
      message: "这是 Qwen Code Coding Plan 路线的地址，不是本模块默认的百炼按量付费 OpenAI 兼容模式。"
    };
  }

  return {
    kind: "custom-compatible",
    ok: true,
    region: "custom",
    message: "这是自定义 OpenAI 兼容地址。本专栏默认只讲百炼北京地域；自定义地址请先回到服务商文档确认。"
  };
}

export function buildQwenRequest(config) {
  return {
    url: normalizeQwenEndpoint(config.baseUrl),
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`
    },
    body: {
      model: config.model,
      messages: [
        { role: "system", content: "You are a concise coding assistant." },
        { role: "user", content: "Reply with exactly: qwen smoke test ok" }
      ],
      stream: false,
      enable_thinking: Boolean(config.enableThinking)
    }
  };
}

export function maskSecret(value) {
  if (!value) return "";
  if (value.length < 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function parseBoolean(value, defaultValue) {
  if (!value) return defaultValue;
  return value === "true";
}

function readEnv(env, key) {
  return String(env[key] ?? "").trim();
}
