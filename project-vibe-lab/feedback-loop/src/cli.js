#!/usr/bin/env node
import {
  FEEDBACK_LOOP_EVIDENCE,
  SAMPLE_FEEDBACK,
  auditFeedbackLoop,
  buildAiPrompt,
  buildFeedbackBrief,
  buildFeedbackChecklist,
  buildSpecFromFeedback,
  buildTaskQueue,
  classifyFeedback,
  extractFeedbackFacts,
  normalizeFeedbackInbox
} from "./feedbackLoop.js";

const args = process.argv.slice(2);
const mode = getArg("--mode", "brief");
const sampleEvidence = ["raw-feedback", "classification", "fact-extraction"];

const handlers = {
  brief: () => buildFeedbackBrief(),
  inbox: () => normalizeFeedbackInbox(SAMPLE_FEEDBACK),
  classify: () => classifyFeedback(SAMPLE_FEEDBACK),
  extract: () => extractFeedbackFacts(SAMPLE_FEEDBACK),
  spec: () => buildSpecFromFeedback(SAMPLE_FEEDBACK),
  tasks: () => buildTaskQueue(SAMPLE_FEEDBACK),
  audit: () => auditFeedbackLoop({ evidence: parseList(getArg("--evidence", sampleEvidence.join(","))) }),
  checklist: () => buildFeedbackChecklist(),
  prompt: () => buildAiPrompt({ product: getArg("--product", "AI 个人效率助手") }),
  evidence: () => auditFeedbackLoop({ evidence: FEEDBACK_LOOP_EVIDENCE })
};

if (!handlers[mode]) {
  console.error(`unknown mode: ${mode}`);
  process.exit(1);
}

const result = handlers[mode]();
if (typeof result === "string") {
  console.log(result);
} else {
  console.log(JSON.stringify(result, null, 2));
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
