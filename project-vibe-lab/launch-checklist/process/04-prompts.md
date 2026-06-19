# 04-prompts

审查提示：

```text
请先做上线前 7 道闸审查。
检查范围、权限、隐私、成本、日志、部署和回滚。
输出 blocked gates、缺失证据、最小发布计划和回滚计划。
不要直接部署，不要接真实支付，不要写入真实模型 key。
```

修复提示：

```text
请只修复 blocked gates 里的证据缺口。
每次只处理一个 gate。
完成后运行 npm test 和对应 smoke test。
```
