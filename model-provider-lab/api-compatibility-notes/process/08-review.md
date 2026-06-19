# 08 复盘

## 做对了什么

- 没有把一次聊天调用写成 Codex 稳定适配。
- 把普通 API smoke test 和 Codex provider 适配证明分开写。
- 把 Responses API 写成长期候选，而不是自动证明稳定。

## 需要防的坑

- 不要把“provider 支持 Responses API”写成“真实工作流一定稳定”。
- 不要把“Chat Completions 能通”写成“Codex provider 能用”。
- 不要跳过真实项目验证。

## 后续改造

- 增加 provider selection guide。
- 增加真实 Codex provider 配置 smoke test。
- 把检查结果接入后续低成本路线选择。
