import {
  buildAiPrompt,
  buildFeedbackRecord,
  buildLandingBrief,
  buildLandingCopy,
  buildLaunchChecklist,
  validateWaitlistInput
} from "./landing-page.js";

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "brief";

const sampleInput = {
  name: args.name || "Ding",
  email: args.email || "ding@example.com",
  role: args.role || "产品经理",
  scenario: args.scenario || "工作计划",
  pain: args.pain || "任务、会议、笔记和账目散在不同地方，早上不知道先处理哪件事。"
};

const result = run(mode, sampleInput, args);
console.log(JSON.stringify(result, null, 2));

function run(modeName, input, options) {
  if (modeName === "brief") {
    return buildLandingBrief();
  }
  if (modeName === "copy") {
    return buildLandingCopy();
  }
  if (modeName === "validate") {
    return validateWaitlistInput(input);
  }
  if (modeName === "feedback") {
    return buildFeedbackRecord(input);
  }
  if (modeName === "checklist") {
    return buildLaunchChecklist();
  }
  if (modeName === "prompt") {
    return { prompt: buildAiPrompt({ surface: options.surface || "codex-app" }) };
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
