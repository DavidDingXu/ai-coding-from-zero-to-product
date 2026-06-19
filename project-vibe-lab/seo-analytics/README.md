# seo-analytics：域名、SEO 和访问统计检查

这是第 24 篇的配套项目之一。

同一篇里先解决“怎么部署成别人能访问”，这里继续处理上线后的基本问题：别人能不能记住地址，搜索引擎能不能理解页面，你能不能看到访问和转化。

本项目不会接真实统计平台 token，也不会承诺搜索排名。它只把上线后必须检查的材料做成可运行清单：

- title、description、OG 标签；
- robots.txt；
- sitemap.xml；
- 隐私页；
- 访问事件；
- UTM 方案；
- 访问日志。

## 快速开始

```bash
cd project-vibe-lab/seo-analytics
npm test
npm run brief
npm run metadata
npm run robots
npm run sitemap
npm run events
npm run audit
npm run checklist
npm run prompt
```

## 常用命令

生成元数据：

```bash
node src/cli.js --mode metadata --origin efficiency.example.com
```

生成 robots.txt：

```bash
node src/cli.js --mode robots --origin https://efficiency.example.com
```

生成 sitemap：

```bash
node src/cli.js --mode sitemap --origin https://efficiency.example.com
```

查看访问事件：

```bash
npm run events
```

默认审查故意不通过：

```bash
npm run audit
```

全部证据齐全时：

```bash
node src/cli.js --mode audit --evidence custom-domain,https,title-description,og-tags,robots-txt,sitemap-xml,privacy-page,analytics-events,utm-plan,access-log
```

## 当前不做什么

- 不接真实统计平台 token。
- 不采集手机号、邮箱、完整模型输入或用户隐私。
- 不承诺搜索引擎立即收录。
- 不做刷排名或黑帽 SEO。

## 给 Codex App 的任务

```text
打开 project-vibe-lab/seo-analytics 项目。
先读 README.md、process/02-spec.md 和 test/seo-analytics.test.js。
请为我的产品站点 https://efficiency.example.com 做域名、SEO 和访问统计检查。
必须检查 title、description、OG 标签、robots.txt、sitemap.xml、隐私页、访问事件和 UTM 方案。
输出 missing evidence、上线后检查清单和不能采集的隐私字段。
不要接入真实统计平台 token，不要承诺搜索引擎立即收录。
```
