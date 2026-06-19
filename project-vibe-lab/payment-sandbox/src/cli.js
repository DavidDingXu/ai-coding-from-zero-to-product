#!/usr/bin/env node
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
  signWebhookPayload
} from "./paymentSandbox.js";

const args = process.argv.slice(2);
const mode = getArg("--mode", "brief");

const sampleEvidence = [
  "order-state-machine",
  "webhook-signature",
  "idempotency-key",
  "entitlement-sync"
];

const handlers = {
  brief: () => buildPaymentSandboxBrief(),
  routes: () => listPaymentRoutes(),
  order: () => createSandboxOrder({
    planId: getArg("--plan", "pro"),
    providerId: getArg("--provider", "local-sandbox"),
    userId: getArg("--user", "u-demo-01")
  }),
  webhook: () => {
    const order = createSandboxOrder({ planId: getArg("--plan", "pro") });
    const event = { id: "evt_paid_1", type: getArg("--event", "payment.succeeded"), providerTradeNo: "sandbox_trade_1" };
    const rawBody = JSON.stringify({ id: event.id, type: event.type, orderId: order.orderId });
    return processWebhookEvent({
      order,
      event,
      rawBody,
      signature: signWebhookPayload(rawBody, "sandbox_secret"),
      secret: "sandbox_secret"
    });
  },
  refund: () => {
    const order = createSandboxOrder({ planId: getArg("--plan", "pro") });
    order.status = "paid";
    order.entitlement = { active: true, planId: order.planId, source: "payment" };
    return processRefundRequest({ order, reason: getArg("--reason", "user_request") });
  },
  audit: () => auditPaymentSandbox({ evidence: parseList(getArg("--evidence", sampleEvidence.join(","))) }),
  checklist: () => buildPaymentSandboxChecklist(),
  prompt: () => buildAiPrompt({ product: getArg("--product", "AI 个人效率助手") }),
  evidence: () => auditPaymentSandbox({ evidence: PAYMENT_SANDBOX_EVIDENCE })
};

if (!handlers[mode]) {
  console.error(`unknown mode: ${mode}`);
  process.exit(1);
}

const result = handlers[mode]();
if (typeof result === "string") {
  console.log(result);
} else {
  console.log(JSON.stringify(result, setJsonReplacer(), 2));
}

function getArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setJsonReplacer() {
  return (_key, value) => {
    if (value instanceof Set) return Array.from(value);
    return value;
  };
}
