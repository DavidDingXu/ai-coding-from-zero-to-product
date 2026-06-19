import crypto from "node:crypto";

export const PAYMENT_ROUTES = [
  {
    id: "local-sandbox",
    name: "本地支付沙箱",
    environment: "sandbox",
    useFor: "先验证订单、回调、幂等、退款和权益开通",
    safeUse: ["不需要真实商户号", "不需要生产密钥", "适合本地跟练"]
  },
  {
    id: "alipay-sandbox",
    name: "支付宝沙箱",
    environment: "provider-sandbox",
    useFor: "国内个人或企业收款前的支付宝能力验证",
    safeUse: ["先读官方沙箱文档", "只使用沙箱应用和沙箱账号", "不要写入生产私钥"]
  },
  {
    id: "wechat-pay",
    name: "微信支付测试路线",
    environment: "provider-sandbox",
    useFor: "国内小程序、H5 或网页支付前的商户能力验证",
    safeUse: ["先确认商户号和 APIv3 密钥要求", "回调必须验签", "生产证书不进入仓库"]
  }
];

export const PLAN_PRICES = {
  free: 0,
  pro: 19,
  team: 99
};

export const PAYMENT_SANDBOX_EVIDENCE = [
  "order-state-machine",
  "webhook-signature",
  "idempotency-key",
  "entitlement-sync",
  "refund-flow",
  "audit-log",
  "no-production-key",
  "provider-doc-check"
];

export function buildPaymentSandboxBrief() {
  return {
    product: "AI 个人效率助手",
    article: 25,
    goal: "先用本地支付沙箱验证订单状态、回调验签、幂等处理、退款模拟和权益开通，再考虑真实通道",
    outOfScope: ["不接真实支付通道", "不保存生产支付密钥", "不生成真实收款记录", "不替代商户资质、税务或合规判断"],
    routes: PAYMENT_ROUTES.map((route) => route.id)
  };
}

export function listPaymentRoutes() {
  return PAYMENT_ROUTES.map((route) => ({ ...route }));
}

export function createSandboxOrder(input = {}) {
  const planId = normalize(input.planId || "pro");
  const providerId = normalize(input.providerId || "local-sandbox");
  const userId = normalize(input.userId || "u-demo-01");
  const amountCny = PLAN_PRICES[planId];
  if (!Number.isFinite(amountCny)) throw new Error(`unknown plan: ${planId}`);
  if (!PAYMENT_ROUTES.some((route) => route.id === providerId)) throw new Error(`unknown provider: ${providerId}`);

  return {
    orderId: input.orderId || `order_${planId}_0001`,
    userId,
    planId,
    providerId,
    amountCny,
    currency: "CNY",
    status: "pending",
    entitlement: { active: false, planId: null, source: null },
    audit: [
      { action: "order.created", orderId: input.orderId || `order_${planId}_0001`, status: "pending" }
    ]
  };
}

export function signWebhookPayload(rawBody, secret = "sandbox_secret") {
  return crypto.createHmac("sha256", secret).update(String(rawBody)).digest("hex");
}

export function verifyWebhookSignature(rawBody, signature, secret = "sandbox_secret") {
  const expected = signWebhookPayload(rawBody, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature || "").padEnd(expected.length, "0").slice(0, expected.length)));
}

export function processWebhookEvent(input = {}) {
  const order = clone(input.order || createSandboxOrder());
  const event = input.event || {};
  const rawBody = input.rawBody || JSON.stringify({ id: event.id, type: event.type, orderId: order.orderId });
  const signature = input.signature || "";
  const secret = input.secret || "sandbox_secret";
  const processedEventIds = new Set(input.processedEventIds || []);
  const audit = [...(order.audit || [])];

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return {
      order,
      audit: [...audit, { action: "webhook.signature_rejected", eventId: event.id || "unknown" }],
      processedEventIds,
      rejected: true
    };
  }

  if (processedEventIds.has(event.id)) {
    return {
      order,
      audit: [...audit, { action: "webhook.duplicate_ignored", eventId: event.id }],
      processedEventIds,
      duplicate: true
    };
  }

  processedEventIds.add(event.id);
  audit.push({ action: "webhook.accepted", eventId: event.id, type: event.type });

  if (event.type === "payment.succeeded") {
    order.status = "paid";
    order.providerTradeNo = event.providerTradeNo || "sandbox_trade_1";
    order.entitlement = { active: true, planId: order.planId, source: "payment" };
    audit.push({ action: "entitlement.activated", orderId: order.orderId, planId: order.planId });
  } else if (event.type === "payment.failed") {
    order.status = "failed";
    order.entitlement = { active: false, planId: null, source: null };
    audit.push({ action: "payment.failed", orderId: order.orderId });
  }

  order.audit = audit;
  return { order, audit, processedEventIds, duplicate: false };
}

export function processRefundRequest(input = {}) {
  const order = clone(input.order || createSandboxOrder());
  if (order.status !== "paid") {
    return {
      order,
      audit: [...(order.audit || []), { action: "refund.rejected", reason: "order_not_paid" }],
      rejected: true
    };
  }

  const refund = {
    refundId: `refund_${order.orderId}`,
    reason: input.reason || "sandbox_refund",
    amountCny: order.amountCny,
    status: "succeeded"
  };
  order.status = "refunded";
  order.refund = refund;
  order.entitlement = { active: false, planId: order.planId, source: "refund" };
  order.audit = [...(order.audit || []), { action: "refund.succeeded", refundId: refund.refundId }, { action: "entitlement.revoked", orderId: order.orderId }];

  return { order, refund, audit: order.audit };
}

export function auditPaymentSandbox(input = {}) {
  const evidence = new Set(input.evidence || []);
  const missing = PAYMENT_SANDBOX_EVIDENCE.filter((item) => !evidence.has(item));
  return {
    status: missing.length === 0 ? "ready-for-provider-sandbox" : "blocked",
    missing,
    provided: PAYMENT_SANDBOX_EVIDENCE.filter((item) => evidence.has(item)),
    message: missing.length === 0
      ? "本地支付沙箱证据齐全，可以进入服务商沙箱，不代表可以使用生产通道"
      : "先补齐订单状态、回调验签、幂等、权益、退款、审计和生产密钥隔离证据"
  };
}

export function buildPaymentSandboxChecklist() {
  return [
    { id: "state", check: "订单状态必须从 pending 到 paid / failed / refunded 可追踪", evidence: ["order-state-machine"] },
    { id: "signature", check: "Webhook 必须使用原始 body 验签，失败请求不能开通权益", evidence: ["webhook-signature"] },
    { id: "idempotency", check: "重复回调只处理一次，不能重复开通或重复扣减", evidence: ["idempotency-key"] },
    { id: "entitlement", check: "支付成功后开通套餐，退款成功后撤销权益", evidence: ["entitlement-sync"] },
    { id: "refund", check: "退款、支付失败和人工处理路径要能模拟", evidence: ["refund-flow", "audit-log"] },
    { id: "live-boundary", check: "生产密钥、商户号和服务商当前规则不进入 demo", evidence: ["no-production-key", "provider-doc-check"] }
  ];
}

export function buildAiPrompt(input = {}) {
  const product = normalize(input.product || "AI 个人效率助手");
  return [
    "打开 project-vibe-lab/payment-sandbox 项目。",
    "先读 README.md、process/02-spec.md 和 test/payment-sandbox.test.js。",
    `请为我的产品「${product}」设计支付沙箱流程。`,
    "必须覆盖订单状态、Webhook 验签、幂等处理、支付失败、退款模拟、权益开通和审计日志。",
    "输出证据缺口、沙箱事件样例、退款样例和进入服务商沙箱前要补的代码能力。",
    "不要接真实支付，不要写入生产密钥，不要把沙箱结果写成真实收款。"
  ].join("\n");
}

function normalize(value) {
  return String(value || "").trim();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
