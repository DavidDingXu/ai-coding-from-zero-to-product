import fs from "node:fs";

import {
  buildAiPrompt,
  buildExtensionBrief,
  buildManifestSummary,
  buildMaterialCard,
  buildPermissionReport,
  buildReadingNoteFromMaterial,
  normalizePageCapture
} from "./browser-extension.js";

const mode = readArg("--mode", "brief");
const surface = readArg("--surface", "codex-app");

const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

const demoCapture = normalizePageCapture({
  title: "胡彦斌用 AI 做 App 的讨论",
  url: "https://example.com/ai-coding-product-news",
  selectedText: "这个案例提醒我们，AI 编程真正值得学的是把想法变成可验证产品的过程。",
  description: "一篇关于 AI 编程和产品实践的文章。"
});

const handlers = {
  brief: () => buildExtensionBrief(),
  manifest: () => buildManifestSummary(manifest),
  capture: () => demoCapture,
  card: () => buildMaterialCard(demoCapture),
  permissions: () => buildPermissionReport(manifest),
  note: () => buildReadingNoteFromMaterial(buildMaterialCard(demoCapture)),
  prompt: () => buildAiPrompt({ surface })
};

if (!handlers[mode]) {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}

const result = handlers[mode]();

if (typeof result === "string") {
  console.log(result);
} else {
  console.log(JSON.stringify(result, null, 2));
}

function readArg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}
