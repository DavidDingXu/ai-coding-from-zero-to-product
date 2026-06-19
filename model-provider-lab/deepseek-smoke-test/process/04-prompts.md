# 04 关键提示词

## 生成模块

```text
请实现一个 DeepSeek smoke test 模块。
目标是验证 DeepSeek OpenAI 兼容 Chat Completions 的最小请求形状。
默认 Base URL 使用 https://api.deepseek.com。
默认模型使用 deepseek-v4-pro。
对 deepseek-chat / deepseek-reasoner 给出旧模型名提示。
支持 dry-run，不发真实请求。
真实调用缺少 DEEPSEEK_API_KEY 时要明确报错。
```

## 排查失败

```text
请先根据输出判断失败属于哪一类：
1. 缺少 DEEPSEEK_API_KEY
2. Base URL 或 endpoint 错误
3. 模型名不可用或已废弃
4. 账号权限或额度问题
5. 网络或服务端错误

不要直接改代码，先给出最小排查步骤。
```
