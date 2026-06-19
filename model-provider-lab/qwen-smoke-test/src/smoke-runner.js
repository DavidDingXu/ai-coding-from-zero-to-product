import {
  buildQwenRequest,
  classifyQwenBaseUrl,
  getQwenConfig,
  maskSecret
} from "./qwen-config.js";

export async function runQwenSmokeTest({ env = process.env, dryRun = false, fetchImpl = fetch } = {}) {
  const config = getQwenConfig(env);
  const baseUrlCheck = classifyQwenBaseUrl(config.baseUrl);
  const request = buildQwenRequest(config);

  if (dryRun) {
    return {
      ok: baseUrlCheck.ok,
      mode: "dry-run",
      provider: "qwen",
      endpoint: request.url,
      model: config.model,
      apiKeyEnv: config.apiKeyEnv,
      apiKey: maskSecret(config.apiKey),
      baseUrlCheck,
      requestBody: request.body,
      boundary: "dry-run 只验证请求形状，不发真实网络请求，也不证明 Codex 完整适配。"
    };
  }

  if (!config.apiKey) {
    throw new Error("缺少 DASHSCOPE_API_KEY 或 BAILIAN_API_KEY。先配置 API Key，或使用 npm run dry-run 检查请求形状。");
  }

  if (!baseUrlCheck.ok) {
    throw new Error(baseUrlCheck.message);
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
    throw new Error(`Qwen smoke test 失败：HTTP ${response.status} ${message}`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Qwen smoke test 失败：响应中没有 choices[0].message.content。");
  }

  return {
    ok: true,
    mode: "live",
    provider: "qwen",
    endpoint: request.url,
    model: config.model,
    apiKeyEnv: config.apiKeyEnv,
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
