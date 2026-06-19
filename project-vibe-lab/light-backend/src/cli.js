import {
  buildAiPrompt,
  buildApiContract,
  buildAuditReport,
  buildBackendBrief,
  buildBackendDecisionGuide,
  buildDataModel,
  buildPermissionMatrix,
  buildProductionGapReport,
  createInMemoryStore,
  createSession,
  listPlanDrafts,
  savePlanDraft
} from "./light-backend.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";

const store = createInMemoryStore();
const ownerSession = createSession(store, { userId: args.userId || "user-owner" });

const outputMap = {
  brief: () => buildBackendBrief(),
  decision: () => buildBackendDecisionGuide(),
  model: () => buildDataModel(),
  session: () => ownerSession,
  save: () => savePlanDraft(store, ownerSession.token, {
    title: args.title,
    summary: args.summary,
    source: "cli-demo"
  }),
  list: () => {
    savePlanDraft(store, ownerSession.token, {
      title: args.title,
      summary: args.summary,
      source: "cli-demo"
    });
    return listPlanDrafts(store, ownerSession.token, { projectId: args.projectId });
  },
  permissions: () => buildPermissionMatrix(),
  api: () => buildApiContract(),
  audit: () => {
    savePlanDraft(store, ownerSession.token, {
      title: args.title,
      summary: args.summary,
      source: "cli-demo"
    });
    listPlanDrafts(store, ownerSession.token, { projectId: args.projectId });
    return buildAuditReport(store);
  },
  production: () => buildProductionGapReport(),
  prompt: () => buildAiPrompt({ surface: args.surface || "codex-app" })
};

if (!outputMap[mode]) {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}

const result = outputMap[mode]();
if (typeof result === "string") {
  console.log(result);
} else {
  console.log(JSON.stringify(result, null, 2));
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) {
      continue;
    }
    const key = arg.slice(2);
    const next = rawArgs[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}
