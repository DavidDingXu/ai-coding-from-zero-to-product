# 02 需求整理

## 用户故事

作为 AI 编程初学者，我希望运行一个命令看到本机 AI 编程工作台是否准备好，这样我知道下一步该处理 Node.js、npm、Codex App / CLI，还是补项目规则。Claude Code 只作为可选对照检查，不影响主线继续。

## 命令

```bash
npm run check
npm run check:json
```

## 检查项

| 检查项 | 成功条件 | 失败提示 |
|---|---|---|
| Node.js | `node --version` 可执行 | 先安装 Node.js |
| npm | `npm --version` 可执行 | 安装 Node.js 后重新打开终端 |
| Codex CLI | `codex --version` 可执行 | 安装或登录 Codex |
| Claude Code CLI | `claude --version` 可执行 | 可选项；需要对照工具时再安装 |
| Codex config | `~/.codex/config.toml` 存在 | 初次使用可先跳过，后续配置再创建 |
| Codex auth | `~/.codex/auth.json` 存在 | 运行 `codex login`；系统凭据存储除外 |
| 全局 AGENTS | `~/.codex/AGENTS.md` 存在 | 后续可添加个人默认规则 |
| 项目 AGENTS | 当前目录或上级目录存在 `AGENTS.md` | 在项目根目录添加项目规则 |
| 项目 CLAUDE | 当前目录或上级目录存在 `CLAUDE.md` | 使用 Claude Code 时添加工具专属规则 |

## 输出

文本输出要适合第一次打开项目时阅读：

```text
[OK] Node.js
[OPTIONAL] Claude Code CLI
下一步：
- Claude Code 可后续再装，不影响当前主线。
```

JSON 输出适合后续自动化：

```json
{
  "ok": true,
  "summary": {
    "total": 7,
    "ok": 7,
    "failed": 0,
    "optional": 2
  }
}
```

## 完成判断

- `npm test` 通过。
- `npm run check` 能输出 7 项必需自检和 2 项可选自检。
- 从子模块目录运行时，也能向上找到项目根目录的 `AGENTS.md`。
- 使用 Claude Code 时，也能提示是否存在 `CLAUDE.md`。
