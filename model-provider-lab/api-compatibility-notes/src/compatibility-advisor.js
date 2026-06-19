export function assessProviderCompatibility({
  provider,
  supportsChatCompletions = false,
  supportsResponsesApi = false,
  supportsStreaming = false,
  supportsToolCalling = false
}) {
  if (supportsResponsesApi && supportsStreaming && supportsToolCalling) {
    return {
      provider,
      level: "responses-codex-candidate",
      longTermRisk: "medium",
      canProveCodexStable: false,
      message: "Provider 支持 Responses API、流式输出和工具调用，是更适合进入 Codex provider 验证的候选；但仍不能跳过真实项目验证。",
      nextChecks: [
        "配置 Codex provider wire_api=responses",
        "验证 codex exec",
        "用真实项目完成改代码、跑测试、浏览器验证"
      ]
    };
  }

  if (supportsChatCompletions && supportsStreaming) {
    return {
      provider,
      level: "chat-smoke-only",
      longTermRisk: "high",
      canProveCodexStable: false,
      message: "Provider 至少能跑 Chat Completions 和流式输出，适合普通接口练习和成本验证；但这不是 Codex provider 适配证明。",
      nextChecks: [
        "确认 Responses API 或等价能力",
        "按当前 Codex 官方配置参考核对 wire_api 支持范围",
        "记录 Chat Completions 只完成普通接口验证"
      ]
    };
  }

  if (supportsChatCompletions) {
    return {
      provider,
      level: "chat-only-smoke-test",
      longTermRisk: "high",
      canProveCodexStable: false,
      message: "Provider 只能证明普通 Chat Completions 最小调用可用，不能证明 AI 编程工作流稳定。",
      nextChecks: [
        "验证流式输出",
        "确认 Responses API",
        "不要把聊天成功写成 Codex 可用"
      ]
    };
  }

  return {
    provider,
    level: "not-ready",
    longTermRisk: "unknown",
    canProveCodexStable: false,
    message: "还没有最小 Chat Completions 或 Responses API 证据，不能进入模型接入判断。",
    nextChecks: ["先跑 provider smoke test"]
  };
}

export function compareWireApis() {
  return [
    {
      api: "chat_completions",
      generalApiStatus: "supported",
      proves: "能按 messages 形式完成一次普通对话请求",
      doesNotProve: "不证明 Responses API、工具调用、长任务和 Codex 完整工作流稳定",
      codexProviderFit: "not-a-codex-provider-proof"
    },
    {
      api: "responses",
      generalApiStatus: "recommended-for-new-projects",
      proves: "更贴近当前 OpenAI agentic workflow 和 Codex 长期接入方向",
      doesNotProve: "不自动证明某个第三方 provider 的实现完全兼容",
      codexProviderFit: "codex-provider-candidate"
    }
  ];
}

export function listCompatibilityChecks() {
  return [
    "最小 Chat Completions 调用",
    "Responses API 支持",
    "按当前 Codex 配置参考核对 wire_api",
    "流式输出",
    "工具调用或等价机制",
    "长上下文与上下文压缩",
    "真实项目改代码、跑测试、浏览器验证"
  ];
}
