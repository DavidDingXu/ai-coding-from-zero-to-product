import {
  buildAiPrompt,
  buildAppBrief,
  buildLaunchChecklist,
  buildSavedActionCardRecord,
  buildPlanPrompt,
  filterActionCards,
  generateActionCards,
  normalizePlanInput
} from "./plan-app.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";

const sampleInput = normalizePlanInput({
  domain: args.domain,
  audience: args.audience,
  goal: args.goal,
  tone: args.tone,
  constraints: args.constraints
});

const result = run(mode, sampleInput, args);
console.log(JSON.stringify(result, null, 2));

function run(modeName, input, options) {
  if (modeName === "brief") {
    return buildAppBrief();
  }
  if (modeName === "generate") {
    return {
      input,
      cards: generateActionCards(input)
    };
  }
  if (modeName === "filter") {
    const cards = generateActionCards(input);
    return {
      filters: pickFilters(options),
      cards: filterActionCards(cards, pickFilters(options))
    };
  }
  if (modeName === "save") {
    const cards = generateActionCards(input);
    return buildSavedActionCardRecord(cards[0], {
      source: "cli-demo",
      note: options.note || "CLI 本地保存演示"
    });
  }
  if (modeName === "prompt") {
    return {
      planPrompt: buildPlanPrompt(input),
      aiPrompt: buildAiPrompt({ surface: options.surface || "codex-app" })
    };
  }
  if (modeName === "checklist") {
    return buildLaunchChecklist();
  }

  throw new Error(`Unknown mode: ${modeName}`);
}

function pickFilters(options) {
  return {
    difficulty: options.difficulty === true ? "" : options.difficulty || "",
    type: options.type === true ? "" : options.type || "",
    stage: options.stage === true ? "" : options.stage || ""
  };
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
