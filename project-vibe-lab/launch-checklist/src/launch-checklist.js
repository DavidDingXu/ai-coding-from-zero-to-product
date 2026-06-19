export const LAUNCH_GATES = [
  {
    id: "scope",
    title: "范围闸",
    question: "这次上线到底开放哪些能力，哪些能力仍然只是 demo？",
    evidence: ["release-scope", "disabled-features", "known-limits"],
    blocks: ["把本地 demo 写成生产可用", "一次性开放未验证功能"],
    owner: "product-engineer"
  },
  {
    id: "permission",
    title: "权限闸",
    question: "用户只能访问属于自己的数据和动作吗？",
    evidence: ["role-matrix", "resource-ownership-tests", "denied-audit-events"],
    blocks: ["跨用户访问", "跨项目写入", "危险动作无人工确认"],
    owner: "backend-engineer"
  },
  {
    id: "privacy",
    title: "隐私闸",
    question: "是否收集了手机号、邮箱、简历、网页内容、Cookie 或公司资料？",
    evidence: ["data-inventory", "privacy-copy", "delete-export-plan"],
    blocks: ["密钥进前端", "敏感信息进日志", "无删除路径"],
    owner: "product-engineer"
  },
  {
    id: "cost",
    title: "成本闸",
    question: "模型、存储、部署和第三方服务的额度怎么控制？",
    evidence: ["quota-policy", "rate-limit", "billing-alert"],
    blocks: ["无限模型调用", "无预算上限", "失败重试无上限"],
    owner: "ops-engineer"
  },
  {
    id: "observability",
    title: "日志闸",
    question: "线上出问题时，能不能定位是谁、何时、做了什么？",
    evidence: ["request-log", "audit-log", "trace-id", "error-dashboard"],
    blocks: ["只看浏览器截图", "没有错误日志", "没有审计查询"],
    owner: "backend-engineer"
  },
  {
    id: "deployment",
    title: "部署闸",
    question: "环境变量、构建产物、域名和健康检查是否可复现？",
    evidence: ["deploy-command", "env-list", "health-check", "smoke-test"],
    blocks: ["手工改线上文件", "真实 key 写进仓库", "部署后不冒烟"],
    owner: "release-owner"
  },
  {
    id: "rollback",
    title: "回滚闸",
    question: "如果上线失败，怎么停掉、回滚、降级和通知？",
    evidence: ["rollback-command", "feature-switch", "incident-contact", "data-backup"],
    blocks: ["无回滚命令", "无开关", "无备份", "没人知道谁处理"],
    owner: "release-owner"
  }
];

export function buildLaunchBrief() {
  return {
    project: "launch-checklist",
    goal: "把可演示 demo 推给别人之前，先过 7 道上线闸",
    gates: LAUNCH_GATES.length,
    outOfScope: [
      "不做真实部署",
      "不接真实支付",
      "不接真实模型 key",
      "不替代安全合规审查"
    ],
    nextArticles: ["24 部署和可访问", "25 商业化沙箱", "26 反馈迁移"]
  };
}

export function listGates() {
  return LAUNCH_GATES.map((gate) => ({
    id: gate.id,
    title: gate.title,
    question: gate.question,
    evidence: gate.evidence,
    owner: gate.owner
  }));
}

export function auditRelease(input = {}) {
  const evidence = new Set(input.evidence || []);
  const gateResults = LAUNCH_GATES.map((gate) => {
    const missing = gate.evidence.filter((item) => !evidence.has(item));
    return {
      id: gate.id,
      title: gate.title,
      status: missing.length === 0 ? "pass" : "blocked",
      missing,
      owner: gate.owner
    };
  });
  return {
    status: gateResults.some((gate) => gate.status === "blocked") ? "blocked" : "ready-for-small-release",
    gateResults,
    mustFix: gateResults.filter((gate) => gate.status === "blocked").map((gate) => gate.id)
  };
}

export function buildReleasePlan(input = {}) {
  const audit = auditRelease(input);
  return {
    status: audit.status,
    steps: audit.status === "ready-for-small-release"
      ? [
          "冻结本次上线范围",
          "备份数据和环境变量清单",
          "执行部署命令",
          "跑 smoke test",
          "观察日志和错误率",
          "保留回滚窗口"
        ]
      : [
          "先补齐 blocked gates 的证据",
          "重新运行 npm test 和 smoke test",
          "只开放小范围用户",
          "确认 rollback-command 和 feature-switch 后再发布"
        ],
    blockedGates: audit.mustFix
  };
}

export function buildRollbackPlan() {
  return {
    trigger: [
      "核心页面无法访问",
      "登录或权限出现越权",
      "模型调用成本异常",
      "错误率持续上升",
      "用户数据写入异常"
    ],
    actions: [
      "关闭 feature switch",
      "回滚上一版构建产物",
      "暂停模型调用或降级为本地规则",
      "保留错误日志和审计事件",
      "通知试用用户和负责人"
    ],
    evidence: ["rollback-command", "feature-switch", "data-backup", "incident-contact"]
  };
}

export function buildEvidenceTemplate() {
  return LAUNCH_GATES.map((gate) => ({
    gate: gate.id,
    evidence: gate.evidence.map((item) => ({
      key: item,
      fileOrCommand: suggestedEvidenceLocation(item)
    }))
  }));
}

export function buildAiPrompt(input = {}) {
  const product = normalizeText(input.product || "行动卡工坊");
  return [
    "打开 launch-checklist 项目。",
    "先读 README.md、process/02-spec.md 和 test/launch-checklist.test.js。",
    `请为我的产品「${product}」做上线前 7 道闸审查。`,
    "必须检查范围、权限、隐私、成本、日志、部署和回滚。",
    "输出 blocked gates、缺失证据、最小发布计划和回滚计划。",
    "不要直接部署，不要接真实支付，不要写入真实模型 key。"
  ].join("\n");
}

function suggestedEvidenceLocation(key) {
  const map = {
    "release-scope": "docs/release-scope.md",
    "disabled-features": "docs/release-scope.md",
    "known-limits": "docs/known-limits.md",
    "role-matrix": "docs/permission-matrix.md",
    "resource-ownership-tests": "npm test",
    "denied-audit-events": "npm run audit",
    "data-inventory": "docs/data-inventory.md",
    "privacy-copy": "docs/privacy-copy.md",
    "delete-export-plan": "docs/data-lifecycle.md",
    "quota-policy": "docs/cost-policy.md",
    "rate-limit": "docs/cost-policy.md",
    "billing-alert": "docs/cost-policy.md",
    "request-log": "logs/request.log sample",
    "audit-log": "npm run audit",
    "trace-id": "logs/request.log sample",
    "error-dashboard": "docs/observability.md",
    "deploy-command": "README.md",
    "env-list": ".env.example",
    "health-check": "npm run health",
    "smoke-test": "npm run smoke",
    "rollback-command": "docs/rollback.md",
    "feature-switch": "docs/rollback.md",
    "incident-contact": "docs/rollback.md",
    "data-backup": "docs/backup.md"
  };
  return map[key] || "docs/evidence.md";
}

function normalizeText(value) {
  const text = String(value || "").trim();
  return text || "你的产品";
}
