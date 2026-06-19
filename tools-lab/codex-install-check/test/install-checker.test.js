import test from "node:test";
import assert from "node:assert/strict";

import {
  buildInstallReport,
  formatTextReport,
  getCodexHome,
  parseCodexVersion,
  findUpFile,
  toCheck
} from "../src/install-checker.js";

test("getCodexHome uses CODEX_HOME when provided", () => {
  assert.equal(getCodexHome({ CODEX_HOME: "/tmp/custom-codex", HOME: "/Users/demo" }), "/tmp/custom-codex");
});

test("getCodexHome falls back to ~/.codex", () => {
  assert.equal(getCodexHome({ HOME: "/Users/demo" }), "/Users/demo/.codex");
});

test("parseCodexVersion extracts a version from common CLI outputs", () => {
  assert.equal(parseCodexVersion("codex 0.134.0"), "0.134.0");
  assert.equal(parseCodexVersion("Codex CLI 1.2.3\n"), "1.2.3");
  assert.equal(parseCodexVersion("unexpected"), null);
});

test("findUpFile locates AGENTS.md from a nested module directory", async () => {
  const found = await findUpFile("/repo/tools-lab/codex-install-check", "AGENTS.md", async (path) => path === "/repo/AGENTS.md");

  assert.equal(found, "/repo/AGENTS.md");
});

test("toCheck creates a normalized report item", () => {
  assert.deepEqual(
    toCheck("codex-cli", true, "Codex CLI found", "codex --version"),
    {
      id: "codex-cli",
      ok: true,
      required: true,
      status: "ok",
      title: "Codex CLI found",
      detail: "codex --version"
    }
  );
});

test("buildInstallReport summarizes a healthy local setup", async () => {
  const report = await buildInstallReport({
    env: { HOME: "/Users/demo" },
    cwd: "/repo/tools-lab/codex-install-check",
    commandExists: async (name) => name === "node" || name === "npm" || name === "codex" || name === "claude",
    runCommand: async (name, args) => {
      if (name === "node" && args[0] === "--version") return { ok: true, stdout: "v24.0.0\n" };
      if (name === "npm" && args[0] === "--version") return { ok: true, stdout: "11.0.0\n" };
      if (name === "codex" && args[0] === "--version") return { ok: true, stdout: "codex 0.134.0\n" };
      if (name === "claude" && args[0] === "--version") return { ok: true, stdout: "1.0.0\n" };
      return { ok: false, stdout: "", stderr: "unknown" };
    },
    fileExists: async (path) => [
      "/Users/demo/.codex/config.toml",
      "/Users/demo/.codex/auth.json",
      "/Users/demo/.codex/AGENTS.md",
      "/repo/AGENTS.md",
      "/repo/CLAUDE.md"
    ].includes(path)
  });

  assert.equal(report.ok, true);
  assert.equal(report.codexHome, "/Users/demo/.codex");
  assert.equal(report.summary.total, 7);
  assert.equal(report.summary.ok, 7);
  assert.equal(report.summary.optional, 2);
  assert.equal(report.checks.find((check) => check.id === "codex-cli").detail, "codex 0.134.0");
  assert.equal(report.checks.find((check) => check.id === "claude-code-cli").detail, "1.0.0");
  assert.equal(report.checks.find((check) => check.id === "project-agents").detail, "/repo/AGENTS.md 已存在");
  assert.equal(report.checks.find((check) => check.id === "project-claude").detail, "/repo/CLAUDE.md 已存在");
});

test("buildInstallReport marks missing Codex CLI as a failed check", async () => {
  const report = await buildInstallReport({
    env: { HOME: "/Users/demo" },
    cwd: "/repo",
    commandExists: async (name) => name === "node" || name === "npm",
    runCommand: async (name) => {
      if (name === "node") return { ok: true, stdout: "v24.0.0\n" };
      if (name === "npm") return { ok: true, stdout: "11.0.0\n" };
      return { ok: false, stdout: "", stderr: "not found" };
    },
    fileExists: async () => false
  });

  assert.equal(report.ok, false);
  assert.equal(report.checks.find((check) => check.id === "codex-cli").ok, false);
  assert.match(report.nextSteps.join("\n"), /安装或登录 Codex/);
});

test("buildInstallReport treats Claude Code as optional when claude command is missing", async () => {
  const report = await buildInstallReport({
    env: { HOME: "/Users/demo" },
    cwd: "/repo",
    commandExists: async (name) => name === "node" || name === "npm" || name === "codex",
    runCommand: async (name) => {
      if (name === "node") return { ok: true, stdout: "v24.0.0\n" };
      if (name === "npm") return { ok: true, stdout: "11.0.0\n" };
      if (name === "codex") return { ok: true, stdout: "codex 0.134.0\n" };
      return { ok: false, stdout: "", stderr: "not found" };
    },
    fileExists: async (path) => [
      "/Users/demo/.codex/config.toml",
      "/Users/demo/.codex/auth.json",
      "/Users/demo/.codex/AGENTS.md",
      "/repo/AGENTS.md"
    ].includes(path)
  });

  assert.equal(report.ok, true);
  assert.equal(report.summary.optional, 2);
  assert.equal(report.checks.find((check) => check.id === "claude-code-cli").ok, true);
  assert.equal(report.checks.find((check) => check.id === "claude-code-cli").required, false);
  assert.equal(report.checks.find((check) => check.id === "project-claude").required, false);
  assert.doesNotMatch(report.nextSteps.join("\n"), /Claude Code/);
});

test("formatTextReport renders a beginner-friendly checklist", () => {
  const output = formatTextReport({
    ok: false,
    codexHome: "/Users/demo/.codex",
    checks: [
      toCheck("node", true, "Node.js", "v24.0.0"),
      toCheck("codex-cli", false, "Codex CLI", "未找到 codex 命令")
    ],
    summary: { total: 2, ok: 1, failed: 1 },
    nextSteps: ["安装或登录 Codex。"]
  });

  assert.match(output, /AI 编程工作台自检/);
  assert.match(output, /\[OK\] Node.js/);
  assert.match(output, /\[FAIL\] Codex CLI/);
  assert.match(output, /安装或登录 Codex/);
});

test("formatTextReport marks optional checks clearly", () => {
  const output = formatTextReport({
    ok: true,
    codexHome: "/Users/demo/.codex",
    checks: [
      toCheck("node", true, "Node.js", "v24.0.0"),
      { ...toCheck("claude-code-cli", true, "Claude Code CLI", "当前可以先跳过"), required: false }
    ],
    summary: { total: 1, ok: 1, failed: 0, optional: 1 },
    nextSteps: []
  });

  assert.match(output, /\[OPTIONAL\] Claude Code CLI/);
});
