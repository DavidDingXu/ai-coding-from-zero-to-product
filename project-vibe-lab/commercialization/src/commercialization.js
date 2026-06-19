export const PRICING_PLANS = [
  {
    id: "free",
    name: "免费试用",
    priceCny: 0,
    monthlyQuota: 20,
    features: ["今日计划生成", "本地保存", "复制结果"],
    limits: ["不含云端历史", "不含团队空间", "不含批量生成"]
  },
  {
    id: "pro",
    name: "个人版",
    priceCny: 19,
    monthlyQuota: 500,
    features: ["更多生成次数", "云端历史", "导出结果", "基础统计"],
    limits: ["不含团队权限", "不含 API 调用"]
  },
  {
    id: "team",
    name: "团队版",
    priceCny: 99,
    monthlyQuota: 3000,
    features: ["团队空间", "权限管理", "审计记录", "成员额度"],
    limits: ["需要人工开通", "支付和发票另行确认"]
  }
];

export const SAMPLE_USAGE = [
  { userId: "u-free-01", planId: "free", action: "plan_generate", inputTokens: 520, outputTokens: 980, count: 12 },
  { userId: "u-pro-01", planId: "pro", action: "plan_generate", inputTokens: 8200, outputTokens: 16400, count: 120 },
  { userId: "u-team-01", planId: "team", action: "plan_generate", inputTokens: 25000, outputTokens: 53000, count: 420 }
];

export const COMMERCIALIZATION_EVIDENCE = [
  "account-id",
  "plan-definition",
  "quota-policy",
  "usage-meter",
  "cost-model",
  "overage-policy",
  "payment-boundary",
  "refund-policy",
  "privacy-copy",
  "audit-log"
];

export function buildCommercializationBrief() {
  return {
    product: "AI 个人效率助手",
    article: 25,
    goal: "在接真实支付前，先把账号、套餐、额度、token 成本、超额策略和支付边界算清楚",
    outOfScope: ["不接真实支付", "不保存真实支付密钥", "不生成真实发票", "不承诺财税合规方案"],
    plans: PRICING_PLANS.map((plan) => plan.id)
  };
}

export function listPlans() {
  return PRICING_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceCny: plan.priceCny,
    monthlyQuota: plan.monthlyQuota,
    features: plan.features,
    limits: plan.limits
  }));
}

export function summarizeUsage(input = {}) {
  const usage = input.usage || SAMPLE_USAGE;
  return usage.map((record) => {
    const plan = planById(record.planId);
    const totalTokens = record.inputTokens + record.outputTokens;
    return {
      ...record,
      totalTokens,
      quotaLeft: Math.max(plan.monthlyQuota - record.count, 0),
      quotaStatus: record.count > plan.monthlyQuota ? "over-quota" : "ok"
    };
  });
}

export function calculateMeter(input = {}) {
  const costPer1kTokensCny = Number(input.costPer1kTokensCny ?? 0.01);
  const usage = summarizeUsage(input);
  return usage.map((record) => {
    const plan = planById(record.planId);
    const modelCostCny = roundMoney((record.totalTokens / 1000) * costPer1kTokensCny);
    const grossMarginCny = roundMoney(plan.priceCny - modelCostCny);
    return {
      userId: record.userId,
      planId: record.planId,
      count: record.count,
      totalTokens: record.totalTokens,
      modelCostCny,
      planPriceCny: plan.priceCny,
      grossMarginCny,
      quotaStatus: record.quotaStatus
    };
  });
}

export function buildMockInvoice(input = {}) {
  const planId = input.planId || "pro";
  const plan = planById(planId);
  return {
    invoiceNo: `MOCK-${plan.id.toUpperCase()}-0001`,
    planId: plan.id,
    amountCny: plan.priceCny,
    status: "draft",
    paymentProvider: "mock",
    note: "这是模拟账单，不代表真实支付、收款、发票或税务处理"
  };
}

export function auditCommercialization(input = {}) {
  const evidence = new Set(input.evidence || []);
  const missing = COMMERCIALIZATION_EVIDENCE.filter((item) => !evidence.has(item));
  return {
    status: missing.length === 0 ? "ready-for-payment-sandbox" : "blocked",
    missing,
    provided: COMMERCIALIZATION_EVIDENCE.filter((item) => evidence.has(item)),
    message: missing.length === 0
      ? "商业化前置证据齐全，可以进入支付沙箱，不代表可以接真实收款"
      : "先补齐账号、套餐、额度、成本、退款、隐私和审计证据"
  };
}

export function buildCommercializationChecklist() {
  return [
    { id: "account", check: "每次使用都能归属到 account-id / user-id", evidence: ["account-id", "audit-log"] },
    { id: "plan", check: "免费、个人版、团队版的额度和功能边界清楚", evidence: ["plan-definition", "quota-policy"] },
    { id: "meter", check: "生成次数、token 用量和模型成本能计算", evidence: ["usage-meter", "cost-model"] },
    { id: "overage", check: "超额时停止、降级还是提示升级", evidence: ["overage-policy"] },
    { id: "payment", check: "支付、退款、隐私和审计边界写清楚", evidence: ["payment-boundary", "refund-policy", "privacy-copy"] }
  ];
}

export function buildAiPrompt(input = {}) {
  const product = normalize(input.product || "AI 个人效率助手");
  return [
    "打开 project-vibe-lab/commercialization 项目。",
    "先读 README.md、process/02-spec.md 和 test/commercialization.test.js。",
    `请为我的产品「${product}」做商业化前置审查。`,
    "必须检查账号、套餐、额度、usage meter、token 成本、超额策略、支付边界、退款边界、隐私说明和审计日志。",
    "输出证据缺口、模拟账单和进入支付沙箱前要补的代码能力。",
    "不要接真实支付，不要写入支付密钥，不要把模拟账单写成真实收款。"
  ].join("\n");
}

function planById(planId) {
  const plan = PRICING_PLANS.find((item) => item.id === planId);
  if (!plan) throw new Error(`unknown plan: ${planId}`);
  return plan;
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function normalize(value) {
  return String(value || "").trim() || "你的产品";
}
