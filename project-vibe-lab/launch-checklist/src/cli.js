import {
  auditRelease,
  buildAiPrompt,
  buildEvidenceTemplate,
  buildLaunchBrief,
  buildReleasePlan,
  buildRollbackPlan,
  listGates
} from "./launch-checklist.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";
const evidence = args.evidence ? args.evidence.split(",").map((item) => item.trim()).filter(Boolean) : sampleEvidence();
const product = args.product || "行动卡工坊";

const output = (() => {
  switch (mode) {
    case "brief":
      return buildLaunchBrief();
    case "gates":
      return listGates();
    case "audit":
      return auditRelease({ evidence });
    case "release":
      return buildReleasePlan({ evidence });
    case "rollback":
      return buildRollbackPlan();
    case "evidence":
      return buildEvidenceTemplate();
    case "prompt":
      return buildAiPrompt({ product });
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
    "release-scope",
    "disabled-features",
    "known-limits",
    "role-matrix",
    "resource-ownership-tests",
    "data-inventory",
    "privacy-copy",
    "quota-policy",
    "request-log",
    "audit-log",
    "deploy-command",
    "env-list",
    "rollback-command"
  ];
}
