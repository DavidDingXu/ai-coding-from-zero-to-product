import {
  assessProviderCompatibility,
  compareWireApis,
  listCompatibilityChecks
} from "./compatibility-advisor.js";

const args = process.argv.slice(2);
const mode = readArg("--mode") || "assess";

if (mode === "compare") {
  console.log(JSON.stringify(compareWireApis(), null, 2));
  process.exit(0);
}

if (mode === "checks") {
  console.log(JSON.stringify(listCompatibilityChecks(), null, 2));
  process.exit(0);
}

const result = assessProviderCompatibility({
  provider: readArg("--provider") || "custom-provider",
  supportsChatCompletions: readBoolean("--chat", true),
  supportsResponsesApi: readBoolean("--responses", false),
  supportsStreaming: readBoolean("--streaming", false),
  supportsToolCalling: readBoolean("--tools", false)
});

console.log(JSON.stringify(result, null, 2));

function readArg(name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] ?? "";
}

function readBoolean(name, defaultValue) {
  const value = readArg(name);
  if (value === null) return defaultValue;
  return value === "true";
}
