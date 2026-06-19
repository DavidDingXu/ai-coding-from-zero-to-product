# 03-context

给 AI 的上下文：

- 前面几篇已经把 demo 推进到小范围试用前的状态。
- 本项目处理试用反馈，不处理新功能开发。
- `test/feedback-loop.test.js` 是行为合同。
- `src/feedbackLoop.js` 是反馈分类、事实提取、spec 和任务生成逻辑。
- 任务输出要服务下一轮 AI 编程，不是客服回复模板。
