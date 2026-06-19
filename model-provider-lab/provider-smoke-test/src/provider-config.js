const PROVIDERS = {
  deepseek: {
    provider: "deepseek",
    displayName: "DeepSeek",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    baseUrlEnv: "DEEPSEEK_BASE_URL",
    modelEnv: "DEEPSEEK_MODEL",
    defaultBaseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-v4-pro",
    requestApi: "chat_completions",
    verifiedEndpoint: "/chat/completions",
    responsesApi: "not_verified_in_this_demo",
    codexRisk: "Chat Completions can be used for a smoke test, but it is not a long-term Codex compatibility proof."
  },
  qwen: {
    provider: "qwen",
    displayName: "Qwen / DashScope",
    apiKeyEnv: "DASHSCOPE_API_KEY",
    baseUrlEnv: "DASHSCOPE_BASE_URL",
    modelEnv: "DASHSCOPE_MODEL",
    defaultBaseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-plus",
    requestApi: "chat_completions",
    verifiedEndpoint: "/chat/completions",
    responsesApi: "available_in_dashscope_docs_but_not_called_by_this_demo",
    codexRisk: "DashScope documents OpenAI-compatible Chat Completions and Responses API, but this demo only verifies Chat Completions."
  }
};

const COMPATIBILITY_LAYERS = [
  {
    id: "minimal-chat-call",
    name: "最小 Chat Completions 调用",
    proves: "API Key、Base URL、模型名、请求体和响应形状基本可用",
    doesNotProve: "Codex provider 配置、Responses API、长任务稳定性和工具调用稳定性"
  },
  {
    id: "codex-provider",
    name: "Codex provider 配置",
    proves: "Codex 能按配置把请求发到目标 provider",
    doesNotProve: "真实项目里的多轮上下文、命令回传、流式输出和失败恢复都稳定"
  },
  {
    id: "project-workflow",
    name: "真实项目工作流",
    proves: "模型能在项目里完成读代码、改文件、跑测试、看浏览器和 Review 的闭环",
    doesNotProve: "所有项目、所有上下文长度和所有工具调用场景都没有风险"
  }
];

export function getProviderConfig(provider, env = process.env) {
  const definition = PROVIDERS[provider];
  if (!definition) {
    throw new Error(`未知 provider：${provider}`);
  }

  return {
    provider: definition.provider,
    displayName: definition.displayName,
    apiKeyEnv: definition.apiKeyEnv,
    baseUrlEnv: definition.baseUrlEnv,
    modelEnv: definition.modelEnv,
    apiKey: readEnv(env, definition.apiKeyEnv),
    baseUrl: readEnv(env, definition.baseUrlEnv) || definition.defaultBaseUrl,
    model: readEnv(env, definition.modelEnv) || definition.defaultModel,
    requestApi: definition.requestApi
  };
}

export function normalizeChatCompletionsUrl(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, "")}/chat/completions`;
}

export function buildChatCompletionRequest(config) {
  return {
    url: normalizeChatCompletionsUrl(config.baseUrl),
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`
    },
    body: {
      model: config.model,
      messages: [
        { role: "system", content: "You are a concise coding assistant." },
        { role: "user", content: "Reply with exactly: provider smoke test ok" }
      ],
      stream: false
    }
  };
}

export function listProviderCompatibility() {
  return {
    generatedAt: "static-demo",
    note: "This matrix is a teaching aid. Re-check provider docs before production use.",
    providers: Object.values(PROVIDERS).map((provider) => ({
      provider: provider.provider,
      displayName: provider.displayName,
      defaultBaseUrl: provider.defaultBaseUrl,
      defaultModel: provider.defaultModel,
      verifiedEndpoint: provider.verifiedEndpoint,
      requestApi: provider.requestApi,
      responsesApi: provider.responsesApi,
      codexRisk: provider.codexRisk
    })),
    layers: COMPATIBILITY_LAYERS
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
