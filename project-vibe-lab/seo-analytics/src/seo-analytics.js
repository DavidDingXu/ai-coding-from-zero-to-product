export const SITE_PAGES = [
  {
    path: "/",
    title: "AI 个人效率助手：把任务、日程、笔记和账目整理成今日计划",
    description: "面向独立开发者和内容团队的 个人效率工具，帮助你把任务、日程、笔记和账目整理成可筛选、可复制、可保存的今日计划。",
    priority: 1.0,
    changefreq: "weekly"
  },
  {
    path: "/privacy",
    title: "隐私说明 - AI 个人效率助手",
    description: "说明 AI 个人效率助手收集哪些数据、如何保存、如何删除以及如何联系维护者。",
    priority: 0.4,
    changefreq: "monthly"
  },
  {
    path: "/feedback",
    title: "反馈入口 - AI 个人效率助手",
    description: "提交使用反馈、问题和下一版功能建议。",
    priority: 0.5,
    changefreq: "weekly"
  }
];

export const ANALYTICS_EVENTS = [
  {
    name: "page_view",
    trigger: "页面加载",
    payload: ["path", "referrer", "utm_source"],
    risk: "不要记录手机号、邮箱、模型输入全文"
  },
  {
    name: "plan_generate",
    trigger: "点击生成今日计划",
    payload: ["card_count", "style", "input_length"],
    risk: "只记录长度和类型，不记录完整输入"
  },
  {
    name: "plan_copy",
    trigger: "复制行动卡",
    payload: ["card_id", "position"],
    risk: "card_id 用本地生成 ID，不要携带用户隐私"
  },
  {
    name: "feedback_submit",
    trigger: "提交反馈",
    payload: ["feedback_type", "length"],
    risk: "反馈正文需要脱敏或单独存储"
  }
];

export const SEO_EVIDENCE = [
  "custom-domain",
  "https",
  "title-description",
  "og-tags",
  "robots-txt",
  "sitemap-xml",
  "privacy-page",
  "analytics-events",
  "utm-plan",
  "access-log"
];

export function buildSeoBrief() {
  return {
    product: "AI 个人效率助手",
    article: 24,
    goal: "让小产品有可访问地址、可被搜索理解，并能看到基础访问和转化数据",
    outOfScope: ["不接真实统计平台 token", "不刷 SEO 排名", "不采集隐私数据", "不承诺搜索引擎立即收录"],
    pages: SITE_PAGES.map((page) => page.path),
    events: ANALYTICS_EVENTS.map((event) => event.name)
  };
}

export function buildMetadata(input = {}) {
  const origin = normalizeOrigin(input.origin || "https://efficiency.example.com");
  return SITE_PAGES.map((page) => ({
    path: page.path,
    url: `${origin}${page.path === "/" ? "" : page.path}`,
    title: page.title,
    description: page.description,
    tags: {
      title: page.title,
      description: page.description,
      "og:title": page.title,
      "og:description": page.description,
      "og:url": `${origin}${page.path === "/" ? "" : page.path}`,
      "og:type": page.path === "/" ? "website" : "article"
    }
  }));
}

export function buildRobots(input = {}) {
  const origin = normalizeOrigin(input.origin || "https://efficiency.example.com");
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin/",
    `Sitemap: ${origin}/sitemap.xml`
  ].join("\n");
}

export function buildSitemap(input = {}) {
  const origin = normalizeOrigin(input.origin || "https://efficiency.example.com");
  const urls = SITE_PAGES.map((page) => ({
    loc: `${origin}${page.path === "/" ? "" : page.path}`,
    changefreq: page.changefreq,
    priority: page.priority
  }));
  return {
    xml: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.flatMap((url) => [
        "  <url>",
        `    <loc>${escapeXml(url.loc)}</loc>`,
        `    <changefreq>${url.changefreq}</changefreq>`,
        `    <priority>${url.priority.toFixed(1)}</priority>`,
        "  </url>"
      ]),
      "</urlset>"
    ].join("\n"),
    urls
  };
}

export function listAnalyticsEvents() {
  return ANALYTICS_EVENTS.map((event) => ({
    name: event.name,
    trigger: event.trigger,
    payload: event.payload,
    risk: event.risk
  }));
}

export function auditSeo(input = {}) {
  const evidence = new Set(input.evidence || []);
  const missing = SEO_EVIDENCE.filter((item) => !evidence.has(item));
  return {
    status: missing.length === 0 ? "ready-for-public-traffic" : "blocked",
    missing,
    provided: SEO_EVIDENCE.filter((item) => evidence.has(item)),
    message: missing.length === 0
      ? "基础访问、SEO 和统计证据齐全，可以进入更大范围公开访问"
      : "先补齐域名、HTTPS、元数据、sitemap、隐私页或统计证据"
  };
}

export function buildLaunchChecklist() {
  return [
    { id: "domain", check: "自定义域名已绑定，HTTPS 可访问", evidence: ["custom-domain", "https"] },
    { id: "metadata", check: "首页有 title、description、OG 标签", evidence: ["title-description", "og-tags"] },
    { id: "crawl", check: "robots.txt 和 sitemap.xml 可访问", evidence: ["robots-txt", "sitemap-xml"] },
    { id: "privacy", check: "隐私页说明收集什么、怎么删除、如何联系", evidence: ["privacy-page"] },
    { id: "analytics", check: "只记录必要事件，不采集敏感内容", evidence: ["analytics-events", "utm-plan", "access-log"] }
  ];
}

export function buildAiPrompt(input = {}) {
  const origin = normalizeOrigin(input.origin || "https://efficiency.example.com");
  return [
    "打开 project-vibe-lab/seo-analytics 项目。",
    "先读 README.md、process/02-spec.md 和 test/seo-analytics.test.js。",
    `请为我的产品站点 ${origin} 做域名、SEO 和访问统计检查。`,
    "必须检查 title、description、OG 标签、robots.txt、sitemap.xml、隐私页、访问事件和 UTM 方案。",
    "输出 missing evidence、上线后检查清单和不能采集的隐私字段。",
    "不要接入真实统计平台 token，不要承诺搜索引擎立即收录。"
  ].join("\n");
}

function normalizeOrigin(value) {
  const text = String(value || "").trim().replace(/\/+$/, "");
  if (!text) return "https://efficiency.example.com";
  return /^https?:\/\//.test(text) ? text : `https://${text}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
