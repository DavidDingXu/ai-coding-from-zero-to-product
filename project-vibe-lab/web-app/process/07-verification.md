# 07 验证记录

## 已执行

```bash
npm test
```

结果：

```text
tests 7
pass 7
fail 0
```

```bash
npm run brief
npm run generate
npm run filter
npm run save
npm run checklist
```

结果：

- `brief` 输出项目范围。
- `generate` 输出 10 张今日行动卡。
- `filter` 默认筛出 `easy` 行动卡。
- `save` 输出 `storage: local-demo` 的保存记录。
- `checklist` 输出 5 个检查项。

## 浏览器验证

```bash
npm start
```

打开：

```text
http://127.0.0.1:5175
```

需要检查：

- `curl -v --max-time 5 http://localhost:5175/` 返回 200 和 HTML。
- 使用 Codex 内置浏览器打开 `http://localhost:5175/`，页面标题为「AI 个人效率助手 Web App」。
- DOM 中包含「生成 10 张行动卡」和「本地计划记录」。
- 已生成真实页面首屏截图：`web-app-page-screenshot.png`。
- 5175 本地服务已关闭，避免端口占用。
