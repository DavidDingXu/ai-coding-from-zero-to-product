# 08 复盘

## 做对了什么

- 没有把百炼兼容模式和 Qwen Code Coding Plan 混在一起。
- 没有把无关地域和历史域名塞进国内读者的主线练习。
- dry-run 默认不需要 API Key，适合先检查请求形状。
- API Key 只做掩码展示，不写入仓库。
- 明确一次 smoke test 不等于 Codex 完整适配。

## 需要防的坑

- 千问相关产品线多，文档里的 Base URL 不一定属于同一条路线。
- 云厂商文档里的域名会迁移，文章和 demo 要定期复核。
- `DASHSCOPE_API_KEY`、`BAILIAN_API_KEY`、Qwen Code Token Plan / Coding Plan 容易混用。
- Chat Completions 能通，不等于 Responses API 能通。

## 后续改造

- 增加真实调用结果样例。
- 增加错误码分类。
- 增加 Codex provider 配置 smoke test。
