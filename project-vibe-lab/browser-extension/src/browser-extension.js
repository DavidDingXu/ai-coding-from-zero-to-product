const defaultCapture = {
  title: "AI 编程实战文章",
  url: "https://example.com/ai-coding-case",
  selectedText: "作者用 Codex App 把一个产品从想法做到可运行页面，并记录了关键过程。",
  description: "一个关于 AI 编程产品实战的网页材料。"
};

const minimalManifest = {
  manifest_version: 3,
  name: "AI 读书笔记助手",
  version: "1.0.0",
  permissions: ["activeTab", "scripting", "storage"],
  action: {
    default_popup: "popup.html"
  }
};

export function buildExtensionBrief() {
  return {
    productName: "AI 读书笔记助手",
    projectId: "browser-extension",
    goal: "从当前网页采集标题、链接和用户选中的文本，生成本地网页摘要卡片和读书笔记。",
    mvpScope: [
      "Manifest V3 最小插件结构",
      "当前激活页面采集",
      "标题、链接、选中文本和描述提取",
      "网页摘要卡片",
      "本地保存和清空"
    ],
    outOfScope: [
      "全站自动爬取",
      "读取登录态、Cookie、表单和私信",
      "绕过付费墙或权限限制",
      "自动上传到远程数据库",
      "真实模型总结"
    ],
    productionUpgrade: [
      "权限说明和敏感页面排除",
      "用户授权、数据导出和删除",
      "远程同步和账号体系",
      "真实模型调用的成本、限流和失败降级",
      "Chrome Web Store 发布材料和隐私政策"
    ]
  };
}

export function buildManifestSummary(manifest = minimalManifest) {
  return {
    manifestVersion: manifest.manifest_version,
    actionPopup: manifest.action?.default_popup,
    permissions: [...(manifest.permissions || [])].sort(),
    hostPermissions: manifest.host_permissions || [],
    usesServiceWorker: Boolean(manifest.background?.service_worker),
    riskLevel: manifest.host_permissions?.length ? "needs-review" : "minimal-mvp"
  };
}

export function normalizePageCapture(input = {}) {
  return {
    title: normalizeText(input.title, defaultCapture.title),
    url: normalizeUrl(input.url, defaultCapture.url),
    selectedText: normalizeText(input.selectedText, ""),
    description: normalizeText(input.description, ""),
    capturedAt: input.capturedAt || new Date().toISOString()
  };
}

export function summarizeMaterial(captureInput = {}) {
  const capture = normalizePageCapture(captureInput);
  const sourceText = capture.selectedText || capture.description || capture.title;
  const summary = truncate(sourceText.replace(/\s+/g, " "), 120);

  return {
    source: capture.selectedText ? "selection" : capture.description ? "description" : "title",
    summary,
    hasSelection: Boolean(capture.selectedText),
    missingSelectionWarning: capture.selectedText
      ? ""
      : "当前没有选中文本，只能基于标题或描述生成素材，建议先选中关键段落。"
  };
}

export function buildMaterialCard(captureInput = {}) {
  const capture = normalizePageCapture(captureInput);
  const material = summarizeMaterial(capture);

  return {
    id: createStableId(capture.url, capture.title),
    title: capture.title,
    url: capture.url,
    summary: material.summary,
    source: material.source,
    storage: "chrome.storage.local",
    privacyLevel: "current-tab-user-triggered",
    nextAction: "把这条素材整理成读书笔记，再提炼 3 个可执行启发。",
    capturedAt: capture.capturedAt,
    warnings: [
      material.missingSelectionWarning,
      "不要采集登录态、Cookie、表单、私信或不可公开内容。"
    ].filter(Boolean)
  };
}

export function buildReadingNoteFromMaterial(cardInput = {}) {
  const card = cardInput.id ? cardInput : buildMaterialCard(cardInput);

  return {
    materialId: card.id,
    title: `围绕「${card.title}」整理一张读书笔记`,
    reason: "素材来自用户主动采集的当前页面，适合继续整理成网页摘要、关键观点和可执行启发。",
    suggestedPrompt: [
      "请基于这条网页素材生成一张读书笔记。",
      `标题：${card.title}`,
      `链接：${card.url}`,
      `摘要：${card.summary}`,
      "要求：不要虚构网页没有出现的事实；输出 3 个要点、1 个可执行启发和后续阅读问题。"
    ].join("\n")
  };
}

export function buildPermissionReport(manifest = minimalManifest) {
  const summary = buildManifestSummary(manifest);
  const permissionNotes = {
    activeTab: "用户点击插件后，临时访问当前激活页面。",
    scripting: "在当前页面执行采集脚本，读取标题、链接和选中文本。",
    storage: "把素材卡片保存到扩展本地存储。"
  };

  return {
    permissions: summary.permissions.map((permission) => ({
      permission,
      reason: permissionNotes[permission] || "需要单独解释用途。"
    })),
    hostPermissions: summary.hostPermissions,
    redLines: [
      "MVP 不声明 https://*/* 或 http://*/* 全站权限。",
      "不读取 Cookie、密码、表单、私信和登录态。",
      "不绕过网站权限、付费墙或访问控制。",
      "进入生产级前要提供数据删除、导出和隐私说明。"
    ],
    productionChecks: [
      "权限说明是否能让普通用户看懂",
      "敏感页面是否排除",
      "采集数据是否可删除",
      "远程同步是否需要登录和加密",
      "模型总结是否有成本、限流和失败处理"
    ]
  };
}

export function buildAiPrompt({ surface = "codex-app" } = {}) {
  const common = [
    "本轮目标：开发「AI 读书笔记助手」浏览器插件 MVP。",
    "先读 README.md、process/02-spec.md、manifest.json 和 test/browser-extension.test.js。",
    "插件使用 Manifest V3，只声明 activeTab、scripting、storage。",
    "MVP 只采集当前激活页面的标题、链接、选中文本和描述，生成本地网页摘要卡片。",
    "不要声明全站 host_permissions，不要采集登录态、Cookie、表单、私信或不可公开内容。",
    "完成后运行 npm test、npm run manifest、npm run permissions，并打开 popup.html 预览界面。"
  ];

  if (surface === "cli") {
    return [
      "在终端进入 project-vibe-lab/browser-extension。",
      ...common,
      "请按测试先行方式实现，最后给出命令输出和插件权限边界说明。"
    ].join("\n");
  }

  return [
    "打开 browser-extension 项目。",
    ...common,
    "请先给出计划，再小步修改文件，最后把验证结果写回 process/07-verification.md。"
  ].join("\n");
}

function normalizeText(value, fallback) {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeUrl(value, fallback) {
  const raw = normalizeText(value, fallback);
  try {
    return new URL(raw).toString();
  } catch {
    return fallback;
  }
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}…`;
}

function createStableId(url, title) {
  const raw = `${url}|${title}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `material-${hash.toString(16).padStart(8, "0")}`;
}
