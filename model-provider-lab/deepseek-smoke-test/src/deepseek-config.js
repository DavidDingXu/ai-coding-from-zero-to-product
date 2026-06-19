const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-pro";
const LEGACY_MODELS = new Set(["deepseek-chat", "deepseek-reasoner"]);
const CURRENT_MODELS = new Set(["deepseek-v4-pro", "deepseek-v4-flash"]);

export function getDeepSeekConfig(env = process.env) {
  return {
    apiKey: readEnv(env, "DEEPSEEK_API_KEY"),
    baseUrl: readEnv(env, "DEEPSEEK_BASE_URL") || DEFAULT_BASE_URL,
    model: readEnv(env, "DEEPSEEK_MODEL") || DEFAULT_MODEL,
    thinking: readEnv(env, "DEEPSEEK_THINKING") || "enabled",
    reasoningEffort: readEnv(env, "DEEPSEEK_REASONING_EFFORT") || "medium"
  };
}

export function normalizeDeepSeekEndpoint(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, "")}/chat/completions`;
}

export function validateDeepSeekModel(model) {
  const normalized = String(model || "").trim();

  if (LEGACY_MODELS.has(normalized)) {
    return {
      ok: false,
      reason: "legacy-model-deprecated",
      message: `${normalized} 属于旧模型名，DeepSeek 官方文档标注将在 2026/07/24 15:59 UTC 废弃。建议改用 deepseek-v4-pro 或 deepseek-v4-flash。`,
      suggestedModel: normalized === "deepseek-chat" ? "deepseek-v4-flash" : "deepseek-v4-pro"
    };
  }

  if (CURRENT_MODELS.has(normalized)) {
    return {
      ok: true,
      reason: "current-model",
      message: `${normalized} 是当前 DeepSeek API 文档中的 V4 模型名。`
    };
  }

  return {
    ok: true,
    reason: "custom-model",
    message: `${normalized} 不是本 demo 内置模型名。请以 DeepSeek 官方模型列表为准。`
  };
}

export function buildDeepSeekRequest(config) {
  return {
    url: normalizeDeepSeekEndpoint(config.baseUrl),
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`
    },
    body: {
      model: config.model,
      messages: [
        { role: "system", content: "You are a concise coding assistant." },
        { role: "user", content: "Reply with exactly: deepseek smoke test ok" }
      ],
      stream: false,
      thinking: { type: config.thinking || "enabled" },
      reasoning_effort: config.reasoningEffort || "medium"
    }
  };
}

export function maskSecret(value) {
  if (!value) return "";
  if (value.length < 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function readEnv(env, key) {
  return String(env[key] ?? "").trim();
}
