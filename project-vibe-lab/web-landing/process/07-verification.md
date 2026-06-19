# 07 verification

## 测试

命令：

```bash
npm test
```

结果：

```text
tests 7
pass 7
```

覆盖：

- 官网范围。
- 页面文案。
- 完整表单。
- 错误表单。
- 密钥类输入拦截。
- 本地候补记录。
- 检查清单。
- Codex App / CLI 提示词。

## CLI 验证

命令：

```bash
npm run brief
npm run feedback
npm run checklist
```

结果：

- `brief` 输出产品目标、范围和不做范围。
- `feedback` 输出 `storage: local-demo`。
- `checklist` 输出页面、表单、隐私、验证和下一步 5 个检查项。

## 页面验证

命令：

```bash
npm start
```

访问：

```text
http://127.0.0.1:5174
```

检查项：

- 首屏展示「把零散素材变成下一周今日计划」。
- 空表单显示缺少称呼、邮箱、角色、领域和痛点。
- 完整表单显示本地候补记录。

当前页面只在浏览器内展示结果，不上传远程服务。
