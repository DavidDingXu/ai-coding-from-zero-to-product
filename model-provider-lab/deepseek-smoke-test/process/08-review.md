# 08 复盘

## 做对了什么

- 没有把旧模型名写成默认值。
- dry-run 默认不需要 API Key，适合先检查请求形状。
- 明确区分 smoke test 和 Codex 完整适配。
- API Key 只做掩码展示，不写入仓库。

## 需要防的坑

- DeepSeek 模型名和 API 行为会变化，发布前要重新核官方文档。
- Chat Completions 能通，不等于 Responses API 能通。
- 一次调用成功，不等于长期稳定。

## 后续改造

- 增加真实调用结果样例。
- 增加错误码分类。
- 增加 Codex provider 配置 smoke test。
