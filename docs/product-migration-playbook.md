# 迁移到自己产品的操作手册

当你准备把专栏里的示例项目迁移到自己的产品时，用这份手册。

第一目标不是复制示例源码，而是把自己的产品想法写清楚、切小，并且能验证。

## 产品档案

写代码前，先把这些信息补齐：

```text
产品名：
目标用户：
用户问题：
第一版用例：
输入：
输出：
约束：
可能的收费方式：
```

示例：

```text
产品名：简历诊断台
目标用户：准备转岗的 3-5 年经验工程师
用户问题：不知道简历问题在哪里，也不知道如何按目标岗位改写
第一版用例：粘贴脱敏简历文本，得到 5 条可执行修改建议
约束：真实隐私数据不进前端，MVP 不做账号系统，模型调用经过后端或本地代理
```

## 迁移路线

```text
mvp-scope
workspace
first-interface
model-and-data
verification
launch
feedback
```

第一个界面还不能测试前，不要跳到真实模型、数据库或部署。

## 最小项目清单

```text
README.md
package.json
.env.example
AGENTS.md
src/
test/
process/
```

`process/` 先从 4 个文件开始：

```text
01-idea.md
02-spec.md
05-plan.md
07-verification.md
```

任务变复杂后，再补这几个文件：

```text
03-context.md
04-prompts.md
06-implementation-log.md
08-review.md
```

目标不是增加文档负担，而是在让 AI 大改代码前，把想法、范围、任务顺序和验证方式摆出来。

## 任务队列

从这些小任务开始：

```text
write-product-profile
cut-first-mvp
create-process-folder
build-first-screen
add-model-boundary
add-verification-gate
prepare-small-trial
```

前两个任务不需要写代码，这是正常的。

## 准备检查

让 AI 大改代码前，先检查有没有这些材料：

```text
product-profile
mvp-scope
process-folder
task-queue
verification-plan
feedback-loop
```

缺少 `task-queue`、`verification-plan` 或 `feedback-loop`，说明项目还不适合让 AI 做大范围改动。

涉及多文件修改、模型接入或重构前，再补 `context-pack`。

用普通话再问一遍：

```text
你能说清谁会用它吗？
你能在一分钟内说清第一版吗？
AI 能看到正确文件吗？
今天能验证一个小结果吗？
用户反馈能变成下一轮 spec 吗？
```

如果有一个答不上来，先补范围和证据，不要继续加代码。

## 产品形态参考

| 产品类型 | 第一版形态 | 重点 |
|---|---|---|
| 内容工具 | Web app | 输入、生成结果、复制和保存 |
| 简历、合同、报告工具 | Web app | 隐私、结构化建议、导出 |
| 浏览器工作流 | Browser extension | 最小权限、当前页面采集 |
| 移动端习惯或短动作 | H5 / mini app | 手机首屏、分享和保存 |
| 需要保存用户数据 | Light backend | 会话、归属、API 合同、删除路径 |
| 需要公开访问 | Deployment + SEO | 构建、环境变量、域名、统计、回滚 |
