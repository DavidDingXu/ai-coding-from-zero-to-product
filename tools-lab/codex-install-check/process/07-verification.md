# 07 验证记录

## 单元测试

命令：

```bash
npm test
```

结果：

```text
✔ getCodexHome uses CODEX_HOME when provided
✔ getCodexHome falls back to ~/.codex
✔ parseCodexVersion extracts a version from common CLI outputs
✔ findUpFile locates AGENTS.md from a nested module directory
✔ toCheck creates a normalized report item
✔ buildInstallReport summarizes a healthy local setup
✔ buildInstallReport marks missing Codex CLI as a failed check
✔ formatTextReport renders a beginner-friendly checklist
ℹ pass 8
ℹ fail 0
```

## 真实自检

命令：

```bash
npm run check
```

示例结果：

```text
Codex 安装自检

Codex home: ~/.codex
结果: 7/7 通过

[OK] Node.js
  v24.14.1
[OK] npm
  11.11.0
[OK] Codex CLI
  codex-cli 0.137.0
[OK] Codex config.toml
  ~/.codex/config.toml 已存在
[OK] Codex 登录缓存
  ~/.codex/auth.json 已存在
[OK] 全局 AGENTS.md
  ~/.codex/AGENTS.md 已存在
[OK] 项目 AGENTS.md
  <项目根目录>/AGENTS.md 已存在
```

## JSON 输出

命令：

```bash
npm run check:json
```

用于后续自动化检查。

## 结论

当前模块能验证本机基础环境，并且不会因为读者在子模块目录运行命令就误判项目 `AGENTS.md` 缺失。
