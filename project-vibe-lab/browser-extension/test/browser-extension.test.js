import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildAiPrompt,
  buildExtensionBrief,
  buildManifestSummary,
  buildMaterialCard,
  buildPermissionReport,
  buildReadingNoteFromMaterial,
  normalizePageCapture,
  summarizeMaterial
} from "../src/browser-extension.js";

const manifest = JSON.parse(fs.readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

test("buildExtensionBrief keeps browser extension MVP focused", () => {
  const brief = buildExtensionBrief();

  assert.equal(brief.productName, "AI 读书笔记助手");
  assert.equal(brief.projectId, "browser-extension");
  assert.ok(brief.mvpScope.includes("当前激活页面采集"));
  assert.ok(brief.mvpScope.includes("网页摘要卡片"));
  assert.ok(brief.outOfScope.includes("全站自动爬取"));
  assert.ok(brief.productionUpgrade.includes("权限说明和敏感页面排除"));
});

test("manifest uses MV3 and minimal MVP permissions", () => {
  const summary = buildManifestSummary(manifest);

  assert.equal(summary.manifestVersion, 3);
  assert.equal(summary.actionPopup, "popup.html");
  assert.deepEqual(summary.permissions, ["activeTab", "scripting", "storage"]);
  assert.deepEqual(summary.hostPermissions, []);
  assert.equal(summary.usesServiceWorker, true);
  assert.equal(summary.riskLevel, "minimal-mvp");
});

test("normalizePageCapture trims inputs and falls back safely", () => {
  const capture = normalizePageCapture({
    title: "  一篇文章  ",
    url: "https://example.com/a",
    selectedText: "  关键段落  ",
    description: "  页面描述  ",
    capturedAt: "2026-06-11T00:00:00.000Z"
  });

  assert.equal(capture.title, "一篇文章");
  assert.equal(capture.url, "https://example.com/a");
  assert.equal(capture.selectedText, "关键段落");
  assert.equal(capture.description, "页面描述");
  assert.equal(capture.capturedAt, "2026-06-11T00:00:00.000Z");

  const fallback = normalizePageCapture({ url: "bad url" });
  assert.equal(fallback.url, "https://example.com/ai-coding-case");
});

test("summarizeMaterial prefers selected text and warns when missing", () => {
  const withSelection = summarizeMaterial({
    title: "标题",
    selectedText: "用户主动选中的段落"
  });
  const withoutSelection = summarizeMaterial({
    title: "标题",
    description: "页面描述"
  });

  assert.equal(withSelection.source, "selection");
  assert.equal(withSelection.hasSelection, true);
  assert.equal(withSelection.missingSelectionWarning, "");
  assert.equal(withoutSelection.source, "description");
  assert.ok(withoutSelection.missingSelectionWarning.includes("当前没有选中文本"));
});

test("buildMaterialCard creates a local extension storage record", () => {
  const card = buildMaterialCard({
    title: "AI 编程文章",
    url: "https://example.com/post",
    selectedText: "这是一段用于整理读书笔记的网页内容。",
    capturedAt: "2026-06-11T00:00:00.000Z"
  });

  assert.match(card.id, /^material-/);
  assert.equal(card.storage, "chrome.storage.local");
  assert.equal(card.privacyLevel, "current-tab-user-triggered");
  assert.equal(card.warnings.length, 1);
  assert.ok(card.nextAction.includes("读书笔记"));
});

test("buildReadingNoteFromMaterial keeps source evidence in prompt", () => {
  const card = buildMaterialCard({
    title: "AI 编程文章",
    url: "https://example.com/post",
    selectedText: "AI 编程真正要学的是过程。"
  });
  const candidate = buildReadingNoteFromMaterial(card);

  assert.equal(candidate.materialId, card.id);
  assert.ok(candidate.title.includes("笔记"));
  assert.ok(candidate.suggestedPrompt.includes("标题：AI 编程文章"));
  assert.ok(candidate.suggestedPrompt.includes("链接：https://example.com/post"));
  assert.ok(candidate.suggestedPrompt.includes("不要虚构网页没有出现的事实"));
});

test("buildPermissionReport explains permissions and production checks", () => {
  const report = buildPermissionReport(manifest);

  assert.ok(report.permissions.some((item) => item.permission === "activeTab"));
  assert.ok(report.permissions.some((item) => item.permission === "scripting"));
  assert.deepEqual(report.hostPermissions, []);
  assert.ok(report.redLines.includes("MVP 不声明 https://*/* 或 http://*/* 全站权限。"));
  assert.ok(report.productionChecks.includes("采集数据是否可删除"));
});

test("buildAiPrompt creates App and CLI routes with extension boundaries", () => {
  const appPrompt = buildAiPrompt({ surface: "codex-app" });
  const cliPrompt = buildAiPrompt({ surface: "cli" });

  assert.ok(appPrompt.includes("browser-extension 项目"));
  assert.ok(appPrompt.includes("Manifest V3"));
  assert.ok(appPrompt.includes("不要声明全站 host_permissions"));
  assert.ok(cliPrompt.includes("project-vibe-lab/browser-extension"));
  assert.ok(cliPrompt.includes("npm test"));
});
