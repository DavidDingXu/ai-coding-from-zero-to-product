# 05 实现计划

## 计划

1. 写 `getCodexHome` 测试。
2. 写版本解析测试。
3. 写报告项格式测试。
4. 写健康环境报告测试。
5. 写缺少 Codex CLI 的失败报告测试。
6. 写向上查找 `AGENTS.md` 的测试。
7. 实现 `install-checker.js`。
8. 实现 CLI。
9. 运行测试。
10. 在真实项目目录运行自检。

## 文件职责

```text
src/install-checker.js  # 检查逻辑、报告格式、向上查找 AGENTS.md
src/cli.js              # 命令行入口
test/install-checker.test.js
README.md
```

## 关键取舍

不做自动安装。

原因：安装动作会修改用户环境，跨系统差异很大，也容易把问题变复杂。第 02 讲只做“看清楚状态”。

不把 `auth.json` 缺失直接判定为严重错误。

原因：Codex 可能使用系统凭据存储。缺少文件不一定代表没登录，但值得提示。

项目 `AGENTS.md` 要向上查找。

原因：Codex 自身会按项目层级发现说明文件，读者也经常在子目录运行命令。
