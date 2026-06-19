import {
  buildDeepSeekRequest,
  getDeepSeekConfig,
  maskSecret,
  validateDeepSeekModel
} from "./deepseek-config.js";

export async function runDeepSeekSmokeTest({ env = process.env, dryRun = false, fetchImpl = fetch } = {}) {
  const config = getDeepSeekConfig(env);
  const modelValidation = validateDeepSeekModel(config.model);
  const request = buildDeepSeekRequest(config);

  if (dryRun) {
    return {
      ok: modelValidation.ok,
      mode: "dry-run",
      provider: "deepseek",
      endpoint: request.url,
      model: config.model,
      modelValidation,
      apiKey: maskSecret(config.apiKey),
      requestBody: request.body,
      boundary: "dry-run 只验证请求形状，不发真实网络请求，也不证明 Codex 完整适配。"
    };
  }

  if (!config.apiKey) {
    throw new Error("缺少 DEEPSEEK_API_KEY。先配置 API Key，或使用 npm run dry-run 检查请求形状。");
  }

  if (!modelValidation.ok) {
    throw new Error(modelValidation.message);
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
    throw new Error(`DeepSeek smoke test 失败：HTTP ${response.status} ${message}`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek smoke test 失败：响应中没有 choices[0].message.content。");
  }

  return {
    ok: true,
    mode: "live",
    provider: "deepseek",
    endpoint: request.url,
    model: config.model,
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
