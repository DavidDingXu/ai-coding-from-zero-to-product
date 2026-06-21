# product-playground：先看到产品，再学习验证

这是配套项目的入口页面。它不要求读者一上来理解 `npm test`、smoke test 或完整工程流程，而是先把自己的产品想法放进去，看到一条可运行的跟练路线。

## 运行

```bash
cd product-playground
npm start
```

打开：

```text
http://127.0.0.1:5172
```

## 你会看到什么

- 输入自己的产品想法和目标用户。
- 生成从第一个网页、官网、Web App、H5、浏览器插件、轻量后端到上线检查的路线。
- 每一站都写清楚先看什么页面结果，再看什么验证证据。
- 生成一条可以直接发给 Codex App 的第一条任务。

## 验证

```bash
npm test
npm run verify
```

`verify` 只是作者和进阶读者的自检入口。新读者先打开页面，看到路线，再进入具体模块。
