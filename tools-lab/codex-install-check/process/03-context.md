# 03 给 AI 的上下文

## 任务背景

这个模块支撑第 02 讲。目标是让先知道自己的本机环境是否适合继续跟练。

## 工程约束

- 使用 Node.js 原生模块。
- 不引入第三方依赖。
- 使用 `node:test` 写测试。
- 不读取或打印密钥内容。
- 命令检查要可测试，不能把所有逻辑写死在 CLI 里。
- 项目 `AGENTS.md` 要从当前目录向上查找。

## 文档事实

根据 Codex 官方手册：

- Codex CLI 和 IDE extension 支持 ChatGPT 登录和 API key 登录。
- Codex 用户级配置在 `~/.codex/config.toml`。
- Codex 会读取全局和项目级 `AGENTS.md`。
- CLI 有 `codex doctor`，可用于更完整的本地诊断。

文章中只能写这些已确认事实。不能凭印象写安装包名、下载地址或版本号。
