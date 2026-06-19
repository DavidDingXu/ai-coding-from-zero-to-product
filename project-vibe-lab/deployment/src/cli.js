import {
  auditDeployment,
  buildAiPrompt,
  buildDeploymentBrief,
  buildDeploymentRunbook,
  buildEvidenceTemplate,
  buildPlatformCommands,
  buildRollbackPlan,
  buildSmokePlan,
  choosePlatform,
  listPlatforms
} from "./deployment.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";
const needs = args.needs ? args.needs.split(",").map((item) => item.trim()).filter(Boolean) : [];
const evidence = args.evidence ? args.evidence.split(",").map((item) => item.trim()).filter(Boolean) : sampleEvidence();

const output = (() => {
  switch (mode) {
    case "brief":
      return buildDeploymentBrief();
    case "platforms":
      return listPlatforms();
    case "choose":
      return choosePlatform({ needs, region: args.region });
    case "runbook":
      return buildDeploymentRunbook({ needs, region: args.region });
    case "commands":
      return buildPlatformCommands(args.platform || "cloudbase-static");
    case "audit":
      return auditDeployment({ evidence });
    case "evidence":
      return buildEvidenceTemplate();
    case "smoke":
      return buildSmokePlan({ url: args.url });
    case "rollback":
      return buildRollbackPlan(args.platform || "cloudbase-static");
    case "prompt":
      return buildAiPrompt({ product: args.product, needs, region: args.region });
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
    "build-command",
    "output-dir",
    "env-list",
    "preview-url",
    "health-check"
  ];
}
