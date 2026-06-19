# 04-prompts

审查提示：

```text
请先为我的产品做部署路线选择。
比较 CloudBase、EdgeOne Pages 和轻量后端。
输出推荐理由、不要选择的情况、部署 runbook、环境变量清单、smoke test 和回滚计划。
不要替我登录云平台，不要写入真实 token，不要直接发生产环境。
```

执行提示：

```text
请只生成部署前 runbook 和检查清单。
如果需要登录、绑定域名、写入 token、执行生产部署，必须停下来让我人工确认。
```
