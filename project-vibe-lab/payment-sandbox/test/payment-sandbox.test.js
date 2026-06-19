import test from "node:test";
import assert from "node:assert/strict";
import {
  PAYMENT_SANDBOX_EVIDENCE,
  auditPaymentSandbox,
  buildAiPrompt,
  buildPaymentSandboxBrief,
  buildPaymentSandboxChecklist,
  createSandboxOrder,
  listPaymentRoutes,
  processRefundRequest,
  processWebhookEvent,
  signWebhookPayload,
  verifyWebhookSignature
} from "../src/paymentSandbox.js";

test("brief keeps payment work in sandbox before real channels", () => {
  const brief = buildPaymentSandboxBrief();

  assert.equal(brief.article, 25);
  assert.ok(brief.outOfScope.includes("不接真实支付通道"));
  assert.ok(brief.outOfScope.includes("不保存生产支付密钥"));
});

test("payment routes keep domestic sandbox choices focused", () => {
  const routes = listPaymentRoutes();

  assert.deepEqual(routes.map((route) => route.id), ["local-sandbox", "alipay-sandbox", "wechat-pay"]);
  assert.ok(routes.every((route) => route.environment !== "production"));
  assert.ok(routes.every((route) => route.safeUse.length > 0));
});

test("sandbox order starts pending without entitlement", () => {
  const order = createSandboxOrder({ planId: "pro", providerId: "local-sandbox", userId: "u1" });

  assert.equal(order.status, "pending");
  assert.equal(order.entitlement.active, false);
  assert.equal(order.amountCny, 19);
  assert.equal(order.providerId, "local-sandbox");
});

test("webhook signature verification rejects changed payload", () => {
  const payload = JSON.stringify({ eventId: "evt_1", orderId: "order_1", type: "payment.succeeded" });
  const signature = signWebhookPayload(payload, "sandbox_secret");

  assert.equal(verifyWebhookSignature(payload, signature, "sandbox_secret"), true);
  assert.equal(verifyWebhookSignature(payload.replace("succeeded", "failed"), signature, "sandbox_secret"), false);
});

test("payment succeeded webhook activates entitlement and writes audit log", () => {
  const order = createSandboxOrder({ planId: "pro", providerId: "local-sandbox", userId: "u1" });
  const result = processWebhookEvent({
    order,
    event: { id: "evt_paid_1", type: "payment.succeeded", providerTradeNo: "sandbox_trade_1" },
    signature: signWebhookPayload(JSON.stringify({ id: "evt_paid_1", type: "payment.succeeded", orderId: order.orderId }), "sandbox_secret"),
    rawBody: JSON.stringify({ id: "evt_paid_1", type: "payment.succeeded", orderId: order.orderId }),
    secret: "sandbox_secret"
  });

  assert.equal(result.order.status, "paid");
  assert.equal(result.order.entitlement.active, true);
  assert.equal(result.order.entitlement.planId, "pro");
  assert.ok(result.audit.some((item) => item.action === "entitlement.activated"));
});

test("duplicate webhook event is idempotent", () => {
  const order = createSandboxOrder({ planId: "pro", providerId: "local-sandbox", userId: "u1" });
  const rawBody = JSON.stringify({ id: "evt_paid_1", type: "payment.succeeded", orderId: order.orderId });
  const signature = signWebhookPayload(rawBody, "sandbox_secret");
  const first = processWebhookEvent({
    order,
    event: { id: "evt_paid_1", type: "payment.succeeded", providerTradeNo: "sandbox_trade_1" },
    rawBody,
    signature,
    secret: "sandbox_secret"
  });
  const second = processWebhookEvent({
    order: first.order,
    event: { id: "evt_paid_1", type: "payment.succeeded", providerTradeNo: "sandbox_trade_1" },
    rawBody,
    signature,
    secret: "sandbox_secret",
    processedEventIds: first.processedEventIds
  });

  assert.equal(second.order.status, "paid");
  assert.equal(second.duplicate, true);
  assert.equal(second.audit.at(-1).action, "webhook.duplicate_ignored");
});

test("refund simulation revokes entitlement and keeps refund id", () => {
  const paidOrder = {
    ...createSandboxOrder({ planId: "pro", providerId: "local-sandbox", userId: "u1" }),
    status: "paid",
    entitlement: { active: true, planId: "pro", source: "payment" }
  };

  const result = processRefundRequest({ order: paidOrder, reason: "user_request" });

  assert.equal(result.order.status, "refunded");
  assert.equal(result.order.entitlement.active, false);
  assert.match(result.order.refund.refundId, /^refund_/);
});

test("audit blocks real channel work until every evidence item exists", () => {
  const audit = auditPaymentSandbox({
    evidence: ["order-state-machine", "webhook-signature", "idempotency-key", "entitlement-sync"]
  });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.missing.includes("refund-flow"));
  assert.ok(audit.missing.includes("no-production-key"));
  assert.ok(audit.missing.includes("provider-doc-check"));
});

test("audit allows provider sandbox only with complete evidence", () => {
  const audit = auditPaymentSandbox({ evidence: PAYMENT_SANDBOX_EVIDENCE });

  assert.equal(audit.status, "ready-for-provider-sandbox");
  assert.equal(audit.missing.length, 0);
});

test("checklist covers state signature idempotency refund and live boundary", () => {
  const checklist = buildPaymentSandboxChecklist();

  assert.deepEqual(checklist.map((item) => item.id), ["state", "signature", "idempotency", "entitlement", "refund", "live-boundary"]);
  assert.ok(checklist.every((item) => item.evidence.length >= 1));
});

test("AI prompt asks for sandbox flow without production payment key", () => {
  const prompt = buildAiPrompt({ product: "AI 个人效率助手" });

  assert.match(prompt, /AI 个人效率助手/);
  assert.match(prompt, /支付沙箱/);
  assert.match(prompt, /订单状态/);
  assert.match(prompt, /不要接真实支付/);
  assert.match(prompt, /不要写入生产密钥/);
});
