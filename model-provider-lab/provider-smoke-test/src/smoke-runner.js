import {
  buildChatCompletionRequest,
  getProviderConfig,
  maskSecret
} from "./provider-config.js";

export async function runSmokeTest({ provider, env = process.env, dryRun = false, fetchImpl = fetch }) {
  const config = getProviderConfig(provider, env);
  const request = buildChatCompletionRequest(config);

  if (dryRun) {
    return {
      ok: true,
      mode: "dry-run",
      provider: config.provider,
      displayName: config.displayName,
      endpoint: request.url,
      model: config.model,
      requestApi: config.requestApi,
      apiKey: maskSecret(config.apiKey),
      requestBody: request.body
    };
  }

  if (!config.apiKey) {
    throw new Error(`缺少 ${config.apiKeyEnv}，请先配置 API Key，或使用 --dry-run 检查请求形状。`);
  }

  const response = await fetchImpl(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body)
  });

  const text = await response.text();
  const payload = parseJson(text);

  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || text || response.statusText;
    throw new Error(`${config.displayName} smoke test 失败：HTTP ${response.status} ${message}`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`${config.displayName} smoke test 失败：响应中没有 choices[0].message.content。`);
  }

  return {
    ok: true,
    mode: "live",
    provider: config.provider,
    displayName: config.displayName,
    endpoint: request.url,
    model: config.model,
    requestApi: config.requestApi,
    apiKey: maskSecret(config.apiKey),
    content,
    usage: payload.usage ?? null
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
