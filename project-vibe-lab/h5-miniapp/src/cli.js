import {
  buildAiPrompt,
  buildFavoriteRecord,
  buildH5Brief,
  buildMobileActionPlan,
  buildPublishChecklist,
  buildShareText,
  buildTopRecommendations,
  normalizeMobileInput
} from "./h5-miniapp.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";
const input = normalizeMobileInput(args);

const result = run(mode, input, args);
console.log(JSON.stringify(result, null, 2));

function run(modeName, normalizedInput, options) {
  if (modeName === "brief") {
    return buildH5Brief();
  }
  if (modeName === "plan") {
    return buildMobileActionPlan(normalizedInput);
  }
  if (modeName === "recommendations") {
    return buildTopRecommendations(normalizedInput);
  }
  if (modeName === "favorite") {
    return buildFavoriteRecord(buildTopRecommendations(normalizedInput)[0], {
      source: "cli-demo",
      note: options.note || "CLI 本地收藏演示"
    });
  }
  if (modeName === "share") {
    return { text: buildShareText(buildMobileActionPlan(normalizedInput)) };
  }
  if (modeName === "publish") {
    return {
      h5: buildPublishChecklist({ route: "h5" }),
      miniapp: buildPublishChecklist({ route: "miniapp" })
    };
  }
  if (modeName === "prompt") {
    return {
      prompt: buildAiPrompt({ surface: options.surface || "codex-app" })
    };
  }

  throw new Error(`Unknown mode: ${modeName}`);
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
