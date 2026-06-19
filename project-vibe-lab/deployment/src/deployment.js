export const DEPLOYMENT_PLATFORMS = [
  {
    id: "cloudbase-static",
    label: "腾讯云 CloudBase",
    bestFor: "国内用户、H5 / 小程序生态、静态网站托管、云函数或云数据库逐步接入",
    avoidWhen: "项目需要更强边缘函数、规则路由或 Pages 工作流",
    deployCommand: "tcb hosting deploy dist -e <envId>",
    previewCommand: "tcb hosting deploy dist -e <envId>",
    productionCommand: "tcb hosting deploy dist -e <envId>",
    envCommand: "tcb env list && tcb env use <envId>",
    rollbackCommand: "重新部署上一版 dist；云托管服务按 tcb cloudrun traffic 做流量回退",
    manualConfirm: ["登录腾讯云账号", "确认云开发环境 ID", "确认静态托管或云应用类型", "确认备案、域名和费用"],
    docs: [
      "https://cloud.tencent.com/document/product/876/41539",
      "https://cloud.tencent.com/document/product/876/19343"
    ]
  },
  {
    id: "edgeone-pages",
    label: "EdgeOne Pages",
    bestFor: "Pages 应用、边缘函数、预览 / 生产环境分离和边缘访问需求",
    avoidWhen: "项目还只是纯本地 demo，不需要边缘函数、CI token 或控制台项目管理",
    deployCommand: "edgeone pages deploy",
    previewCommand: "edgeone pages deploy -e preview",
    productionCommand: "edgeone pages deploy -e production",
    envCommand: "edgeone pages env ls && edgeone pages env pull",
    rollbackCommand: "保留上一版构建包并重新部署，或按控制台部署记录回退",
    manualConfirm: ["登录 EdgeOne 账号", "确认 Pages Project", "确认 API Token 权限", "确认环境变量来源"],
    docs: [
      "https://pages.edgeone.ai/document/edgeone-cli",
      "https://pages.edgeone.ai/document/project-management"
    ]
  },
  {
    id: "light-backend",
    label: "轻量后端 + 前端部署",
    bestFor: "需要登录、数据库、模型代理、权限审计或服务端密钥保护的产品",
    avoidWhen: "第一版只是落地页或纯前端交互，后端会显著拖慢验证",
    deployCommand: "先部署后端服务，再部署前端静态站",
    previewCommand: "后端 staging 环境 + 前端 preview URL",
    productionCommand: "后端 production 环境 + 前端 production 域名",
    envCommand: "后端读取服务端密钥，前端只保留 PUBLIC_ 开头配置",
    rollbackCommand: "回滚后端版本，关闭 feature switch，再回滚前端构建产物",
    manualConfirm: ["确认数据库备份", "确认模型 Key 只在服务端", "确认权限测试通过", "确认日志和告警"],
    docs: []
  }
];

export const DEPLOYMENT_EVIDENCE = [
  "release-scope",
  "build-command",
  "output-dir",
  "env-list",
  "preview-url",
  "health-check",
  "smoke-test",
  "rollback-command",
  "previous-artifact",
  "incident-contact"
];

export function buildDeploymentBrief() {
  return {
    product: "AI 个人效率助手",
    module: "上线商业化与迁移",
    article: 24,
    goal: "把 demo 部署成别人能访问的小范围试用版本，同时保留环境变量、健康检查、smoke test 和回滚路径",
    outOfScope: ["不替读者登录云平台", "不写入真实 token", "不直接发布生产环境", "不接真实支付"],
    platforms: DEPLOYMENT_PLATFORMS.map((item) => item.id)
  };
}

export function listPlatforms() {
  return DEPLOYMENT_PLATFORMS.map((platform) => ({
    id: platform.id,
    label: platform.label,
    bestFor: platform.bestFor,
    avoidWhen: platform.avoidWhen
  }));
}

export function choosePlatform(input = {}) {
  const needs = new Set(input.needs || []);
  if (needs.has("login") || needs.has("database") || needs.has("model-proxy") || needs.has("permission")) {
    return platformById("light-backend");
  }
  if (needs.has("edge-functions") || needs.has("global-edge")) {
    return platformById("edgeone-pages");
  }
  if (needs.has("miniapp") || needs.has("cloud-functions")) {
    return platformById("cloudbase-static");
  }
  return platformById("cloudbase-static");
}

export function buildDeploymentRunbook(input = {}) {
  const platform = choosePlatform(input);
  return {
    platform: platform.id,
    title: `${platform.label} 小范围部署 runbook`,
    steps: [
      "冻结本次 release scope，只发布一个主路径",
      "运行 npm test，确认本地行为没有坏",
      "运行 npm run build，记录 output-dir",
      "检查 .env.example 和真实环境变量，不把真实 key 写入仓库",
      "先创建 preview deployment，拿到 preview-url",
      "对 preview-url 执行 health-check 和 smoke-test",
      "确认 rollback-command、previous-artifact 和 incident-contact",
      "小范围开放给试用用户",
      "观察错误日志、成本和用户反馈"
    ],
    platformCommands: buildPlatformCommands(platform.id),
    stopRules: [
      "测试失败",
      "环境变量缺失",
      "preview-url 无法访问",
      "smoke-test 失败",
      "没有 rollback-command"
    ]
  };
}

export function buildPlatformCommands(platformId = "cloudbase-static") {
  const platform = platformById(platformId);
  return {
    platform: platform.id,
    deploy: platform.deployCommand,
    preview: platform.previewCommand,
    production: platform.productionCommand,
    env: platform.envCommand,
    rollback: platform.rollbackCommand,
    manualConfirm: platform.manualConfirm,
    docs: platform.docs
  };
}

export function auditDeployment(input = {}) {
  const evidence = new Set(input.evidence || []);
  const missing = DEPLOYMENT_EVIDENCE.filter((item) => !evidence.has(item));
  return {
    status: missing.length === 0 ? "ready-for-small-release" : "blocked",
    missing,
    provided: DEPLOYMENT_EVIDENCE.filter((item) => evidence.has(item)),
    message: missing.length === 0
      ? "证据齐全，可以进入小范围发布，不代表完整生产级"
      : "先补齐缺失证据，不要直接发布生产环境"
  };
}

export function buildEvidenceTemplate() {
  return DEPLOYMENT_EVIDENCE.map((key) => ({
    key,
    fileOrCommand: evidenceLocation(key)
  }));
}

export function buildSmokePlan(input = {}) {
  const url = normalizeUrl(input.url || "https://preview.example.com");
  return {
    url,
    checks: [
      { id: "open-home", action: `打开 ${url}`, expected: "页面返回 200，首屏可见" },
      { id: "submit-main-form", action: "提交主路径表单", expected: "出现成功反馈或生成结果" },
      { id: "refresh-state", action: "刷新页面", expected: "不会白屏，必要状态能恢复或给出提示" },
      { id: "error-path", action: "模拟空输入或失败响应", expected: "页面给出可理解错误，不泄露 key 和堆栈" }
    ],
    evidence: ["preview-url", "health-check", "smoke-test"]
  };
}

export function buildRollbackPlan(platformId = "cloudbase-static") {
  const platform = platformById(platformId);
  return {
    platform: platform.id,
    trigger: ["页面不可访问", "核心表单失败", "权限或数据异常", "模型成本异常", "错误率持续上升"],
    command: platform.rollbackCommand,
    actions: [
      "暂停新用户入口或关闭 feature switch",
      "恢复上一版构建产物或平台部署版本",
      "确认 health-check 恢复",
      "保留日志和失败样本",
      "通知试用用户和负责人"
    ]
  };
}

export function buildAiPrompt(input = {}) {
  const product = normalize(input.product || "AI 个人效率助手");
  const platform = choosePlatform(input);
  return [
    "打开 project-vibe-lab/deployment 项目。",
    "先读 README.md、process/02-spec.md 和 test/deployment.test.js。",
    `请为我的产品「${product}」制定小范围部署方案。`,
    `候选平台优先考虑 ${platform.label}，但如果证据不足，要说明为什么。`,
    "必须输出平台选择理由、部署 runbook、环境变量清单、preview 验证、smoke test 和回滚计划。",
    "不要替我登录云平台，不要写入真实 token，不要直接发布生产环境。"
  ].join("\n");
}

function platformById(id) {
  const platform = DEPLOYMENT_PLATFORMS.find((item) => item.id === id);
  if (!platform) throw new Error(`unknown platform: ${id}`);
  return platform;
}

function evidenceLocation(key) {
  const map = {
    "release-scope": "docs/release-scope.md",
    "build-command": "README.md 或 package.json scripts",
    "output-dir": "README.md",
    "env-list": ".env.example 和云平台环境变量列表",
    "preview-url": "部署平台 preview URL",
    "health-check": "npm run health 或 curl <preview-url>",
    "smoke-test": "npm run smoke 或浏览器验证记录",
    "rollback-command": "docs/rollback.md",
    "previous-artifact": "上一版 dist / deployment id / release tag",
    "incident-contact": "docs/rollback.md"
  };
  return map[key] || "docs/deployment-evidence.md";
}

function normalize(value) {
  return String(value || "").trim() || "AI 个人效率助手";
}

function normalizeUrl(value) {
  const text = normalize(value);
  return /^https?:\/\//.test(text) ? text : `https://${text}`;
}
