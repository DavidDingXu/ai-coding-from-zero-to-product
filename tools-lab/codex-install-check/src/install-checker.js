import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, parse } from "node:path";
import { spawn } from "node:child_process";

export async function buildInstallReport(options = {}) {
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const commandExists = options.commandExists ?? defaultCommandExists;
  const runCommand = options.runCommand ?? defaultRunCommand;
  const fileExists = options.fileExists ?? defaultFileExists;
  const codexHome = getCodexHome(env);

  const checks = [];

  checks.push(await checkCommand({
    id: "node",
    title: "Node.js",
    command: "node",
    args: ["--version"],
    commandExists,
    runCommand,
    missingDetail: "未找到 node 命令。先安装 Node.js，再重新打开终端。"
  }));

  checks.push(await checkCommand({
    id: "npm",
    title: "npm",
    command: "npm",
    args: ["--version"],
    commandExists,
    runCommand,
    missingDetail: "未找到 npm 命令。通常安装 Node.js 后会一起安装 npm。"
  }));

  const codexCheck = await checkCommand({
    id: "codex-cli",
    title: "Codex CLI",
    command: "codex",
    args: ["--version"],
    commandExists,
    runCommand,
    missingDetail: "未找到 codex 命令。先安装或登录 Codex。"
  });
  checks.push(codexCheck);

  checks.push(await checkCommand({
    id: "claude-code-cli",
    title: "Claude Code CLI",
    command: "claude",
    args: ["--version"],
    commandExists,
    runCommand,
    required: false,
    missingDetail: "未找到 claude 命令。当前可以先跳过；后面想走 Claude Code 对照路线时，再安装并运行 `claude --version`。"
  }));

  checks.push(toCheck(
    "codex-config",
    await fileExists(join(codexHome, "config.toml")),
    "Codex config.toml",
    await fileExists(join(codexHome, "config.toml"))
      ? `${join(codexHome, "config.toml")} 已存在`
      : `${join(codexHome, "config.toml")} 不存在；第一次使用可以先跳过，后续配置模型和权限时再创建。`
  ));

  checks.push(toCheck(
    "codex-auth",
    await fileExists(join(codexHome, "auth.json")),
    "Codex 登录缓存",
    await fileExists(join(codexHome, "auth.json"))
      ? `${join(codexHome, "auth.json")} 已存在`
      : `${join(codexHome, "auth.json")} 不存在；如果使用系统凭据存储，这不一定是问题。`
  ));

  checks.push(toCheck(
    "global-agents",
    await fileExists(join(codexHome, "AGENTS.md")),
    "全局 AGENTS.md",
    await fileExists(join(codexHome, "AGENTS.md"))
      ? `${join(codexHome, "AGENTS.md")} 已存在`
      : "未找到全局 AGENTS.md；可以后续再添加个人默认工作约束。"
  ));

  const projectAgentsPath = await findUpFile(cwd, "AGENTS.md", fileExists);
  checks.push(toCheck(
    "project-agents",
    Boolean(projectAgentsPath),
    "项目 AGENTS.md",
    projectAgentsPath
      ? `${projectAgentsPath} 已存在`
      : "当前目录和上级目录都没有 AGENTS.md；在项目根目录添加后，Codex 更容易遵守项目规则。"
  ));

  const projectClaudePath = await findUpFile(cwd, "CLAUDE.md", fileExists);
  checks.push({
    ...toCheck(
      "project-claude",
      true,
      "项目 CLAUDE.md",
      projectClaudePath
        ? `${projectClaudePath} 已存在`
        : "当前目录和上级目录都没有 CLAUDE.md；如果你使用 Claude Code，可以后续添加工具专属规则。"
    ),
    required: false
  });

  const summary = summarize(checks);
  const nextSteps = buildNextSteps(checks);

  return {
    ok: summary.failed === 0,
    codexHome,
    checks,
    summary,
    nextSteps
  };
}

export function getCodexHome(env = process.env) {
  if (env.CODEX_HOME) return env.CODEX_HOME;
  const home = env.HOME || env.USERPROFILE;
  return home ? join(home, ".codex") : ".codex";
}

export function parseCodexVersion(output) {
  const match = String(output).match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

export async function findUpFile(startDir, filename, fileExists = defaultFileExists) {
  let current = startDir;
  const root = parse(startDir).root;

  while (true) {
    const candidate = join(current, filename);
    if (await fileExists(candidate)) {
      return candidate;
    }
    if (current === root) {
      return null;
    }
    current = dirname(current);
  }
}

export function toCheck(id, ok, title, detail) {
  return {
    id,
    ok,
    required: true,
    status: ok ? "ok" : "fail",
    title,
    detail
  };
}

export function formatTextReport(report) {
  const lines = [
    "AI 编程工作台自检",
    "",
    `Codex home: ${report.codexHome}`,
    `结果: ${report.summary.ok}/${report.summary.total} 通过`,
    ""
  ];

  for (const check of report.checks) {
    const label = check.required === false ? "OPTIONAL" : check.ok ? "OK" : "FAIL";
    lines.push(`[${label}] ${check.title}`);
    lines.push(`  ${check.detail}`);
  }

  if (report.nextSteps.length) {
    lines.push("");
    lines.push("下一步：");
    for (const step of report.nextSteps) {
      lines.push(`- ${step}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function checkCommand({ id, title, command, args, commandExists, runCommand, missingDetail, required = true }) {
  if (!(await commandExists(command))) {
    return {
      ...toCheck(id, required ? false : true, title, missingDetail),
      required
    };
  }

  const result = await runCommand(command, args);
  if (!result.ok) {
    return {
      ...toCheck(id, required ? false : true, title, result.stderr || `${command} ${args.join(" ")} 执行失败`),
      required
    };
  }

  const output = result.stdout.trim();
  const detail = command === "codex"
    ? output || `version: ${parseCodexVersion(output) ?? "unknown"}`
    : output;
  return {
    ...toCheck(id, true, title, detail),
    required
  };
}

function summarize(checks) {
  const requiredChecks = checks.filter((check) => check.required !== false);
  const ok = requiredChecks.filter((check) => check.ok).length;
  const optional = checks.length - requiredChecks.length;
  return {
    total: requiredChecks.length,
    ok,
    failed: requiredChecks.length - ok,
    optional
  };
}

function buildNextSteps(checks) {
  const failed = new Set(checks.filter((check) => !check.ok).map((check) => check.id));
  const steps = [];

  if (failed.has("node") || failed.has("npm")) {
    steps.push("先安装 Node.js，并重新打开终端后再运行本工具。");
  }
  if (failed.has("codex-cli")) {
    steps.push("安装或登录 Codex，然后运行 `codex --version` 确认命令可用。");
  }
  if (failed.has("claude-code-cli")) {
    steps.push("Claude Code 是可选对照路线；如果暂时只走 Codex App 主线，可以先跳过。");
  }
  if (failed.has("codex-auth")) {
    steps.push("运行 `codex login` 完成登录；如果使用系统凭据存储，缺少 auth.json 不一定代表失败。");
  }
  if (failed.has("project-agents")) {
    steps.push("在项目根目录添加 AGENTS.md，把项目规则、测试命令和输出要求写清楚。");
  }
  if (failed.has("project-claude")) {
    steps.push("如果你会使用 Claude Code，在项目根目录添加 CLAUDE.md；只用 Codex 时可以先跳过。");
  }

  return steps;
}

async function defaultCommandExists(command) {
  const result = await defaultRunCommand("sh", ["-lc", `command -v ${escapeShellArg(command)}`]);
  return result.ok;
}

async function defaultFileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function defaultRunCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      resolve({ ok: false, stdout, stderr: error.message });
    });
    child.on("close", (code) => {
      resolve({ ok: code === 0, stdout, stderr });
    });
  });
}

function escapeShellArg(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}
