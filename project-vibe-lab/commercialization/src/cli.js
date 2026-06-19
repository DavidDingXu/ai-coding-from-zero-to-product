import {
  auditCommercialization,
  buildAiPrompt,
  buildCommercializationBrief,
  buildCommercializationChecklist,
  buildMockInvoice,
  calculateMeter,
  listPlans,
  summarizeUsage
} from "./commercialization.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";
const evidence = args.evidence ? args.evidence.split(",").map((item) => item.trim()).filter(Boolean) : sampleEvidence();

const output = (() => {
  switch (mode) {
    case "brief":
      return buildCommercializationBrief();
    case "plans":
      return listPlans();
    case "usage":
      return summarizeUsage();
    case "meter":
      return calculateMeter({ costPer1kTokensCny: args.cost });
    case "invoice":
      return buildMockInvoice({ planId: args.plan || "pro" });
    case "audit":
      return auditCommercialization({ evidence });
    case "checklist":
      return buildCommercializationChecklist();
    case "prompt":
      return buildAiPrompt({ product: args.product });
    default:
      throw new Error(`unknown mode: ${mode}`);
  }
})();

console.log(typeof output === "string" ? output : JSON.stringify(output, null, 2));

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item.startsWith("--")) {
      const key = item.slice(2);
      result[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      if (result[key] !== true) i += 1;
    }
  }
  return result;
}

function sampleEvidence() {
  return [
    "account-id",
    "plan-definition",
    "quota-policy",
    "usage-meter",
    "cost-model"
  ];
}
