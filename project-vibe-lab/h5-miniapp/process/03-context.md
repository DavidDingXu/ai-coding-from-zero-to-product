# 03 给 AI 的上下文

本轮开发前，先让 AI 读取这些文件：

```text
README.md
process/01-idea.md
process/02-spec.md
test/h5-miniapp.test.js
package.json
```

如果是在已有项目上扩展，还需要读取：

```text
../web-app/README.md
../web-app/process/02-spec.md
../web-app/src/recommendation-app.js
```

但不要把 `web-app` 的完整实现照搬过来。H5 版本的目标不是更多功能，而是更短路径。

给 AI 的关键上下文：

```text
这是AI 个人效率助手移动端版本。
它要帮助读者学习如何把自己的产品压缩成手机上能验证的 H5 版本。
当前只做本地 demo，不接真实模型和平台发布。
所有输出都必须能用 npm test 或 CLI 命令验证。
```
