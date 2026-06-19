# 04 关键提示词

## 生成模块

```text
请实现一个 qwen-smoke-test 模块。
目标是验证百炼 / DashScope OpenAI 兼容模式的最小 Chat Completions 请求形状。
默认 Base URL 使用 https://dashscope.aliyuncs.com/compatible-mode/v1。
默认模型使用 qwen-plus。
支持 DASHSCOPE_API_KEY，也兼容 BAILIAN_API_KEY。
如果用户把 https://coding.dashscope.aliyuncs.com/v1 填进来，要提示这是 Qwen Code Coding Plan，不是本模块默认路线。
```

## 排查失败

```text
请先根据输出判断失败属于哪一类：
1. 缺少 DASHSCOPE_API_KEY / BAILIAN_API_KEY
2. Base URL 是百炼北京地域兼容模式，还是 Coding Plan
3. 模型名是否可用
4. 账号权限、额度或地域问题
5. 网络或服务端错误

不要直接修改代码，先给出最小排查步骤。
```
