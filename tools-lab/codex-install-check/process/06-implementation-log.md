# 06 实现记录

## 第 1 轮：写测试

先写 `test/install-checker.test.js`。

覆盖：

- `CODEX_HOME` 优先级。
- 默认 `~/.codex`。
- Codex 版本号解析。
- 报告项格式。
- 健康环境报告。
- 缺少 Codex CLI 的失败报告。
- 文本报告格式。

第一次运行测试失败：

```text
ERR_MODULE_NOT_FOUND
```

原因是 `src/install-checker.js` 尚未实现，这是预期红灯。

## 第 2 轮：实现检查器

创建：

```text
src/install-checker.js
src/cli.js
```

实现：

- 命令存在性检查。
- `node --version`、`npm --version`、`codex --version`。
- Codex home 定位。
- `config.toml`、`auth.json`、全局 `AGENTS.md`、项目 `AGENTS.md` 检查。
- 文本和 JSON 输出。

## 第 3 轮：真实运行暴露问题

从模块目录运行：

```bash
npm run check
```

首次结果显示 6/7，通过项里项目 `AGENTS.md` 失败。

但项目根目录实际存在：

```text
<项目根目录>/AGENTS.md
```

根因：工具只检查当前目录，没有向上查找。

## 第 4 轮：补复现测试

增加测试：

```text
findUpFile locates AGENTS.md from a nested module directory
```

先看到测试失败，再实现 `findUpFile`。

## 第 5 轮：修根因

项目 `AGENTS.md` 检查改为：

```text
从当前目录开始，逐级向上查找 AGENTS.md，直到文件系统根目录
```

重新运行：

```bash
npm test
npm run check
```

结果变为 7/7 通过。
