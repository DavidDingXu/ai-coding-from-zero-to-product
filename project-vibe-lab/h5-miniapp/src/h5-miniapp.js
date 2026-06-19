const defaultInput = {
  product: "AI 个人效率助手",
  domain: "工作和学习",
  audience: "想提升效率的普通用户",
  scene: "手机上快速整理",
  timeBudget: "10 分钟",
  material: "今天有 2 个任务、1 个会议和一篇待读文章",
  publishTarget: "微信私聊或社群"
};

const recommendationTemplates = [
  {
    id: "mobile-recommendation-01",
    label: "先排今日重点",
    title: "用 {timeBudget} 在手机上把「{domain}」整理成今日计划",
    mobileReason: "适合移动端，因为用户只需要补齐场景、素材和下一步动作，不需要长篇输入。",
    quickAction: "先写 3 行：今天必须做什么、最晚什么时候做、完成标准是什么。",
    shareSuffix: "适合发给自己或项目群，作为下一轮行动输入。"
  },
  {
    id: "mobile-recommendation-02",
    label: "先做行动建议",
    title: "{audience}今天能先做的 3 个「{domain}」行动",
    mobileReason: "适合移动端，因为结果压缩成 3 条，用户能在碎片时间里直接选一条。",
    quickAction: "收藏最该做的一条，补一句为什么今天必须先做它。",
    shareSuffix: "适合发到微信或笔记里，先按一条行动推进。"
  },
  {
    id: "mobile-recommendation-03",
    label: "先确认发布路径",
    title: "从 H5 到小程序：{product} 第一版该先发链接还是提审",
    mobileReason: "适合移动端，因为它提醒读者先区分 H5 链接验证和小程序审核发布。",
    quickAction: "先用 H5 链接验证流程，再整理小程序主体、类目和审核材料。",
    shareSuffix: "适合作为发布前检查，避免把 H5 demo 写成已上线小程序。"
  }
];

export function buildH5Brief() {
  return {
    productName: "AI 个人效率助手",
    projectId: "h5-miniapp",
    pageGoal: "把 Web App 的完整输入压缩成手机端可完成的短流程。",
    primaryAudience: "学生、上班族、产品经理、运营和独立开发者",
    firstPagePromise: "在手机上输入少量上下文，得到 3 条今日行动建议，收藏一条，并生成可复制的行动文本。",
    inScope: [
      "移动端短输入",
      "生成 3 条今日行动建议",
      "收藏本地推荐",
      "生成可分享的行动文本",
      "区分 H5 链接和小程序提审路径"
    ],
    outOfScope: [
      "真实小程序上传审核",
      "真实模型调用",
      "账号登录和 openid",
      "云数据库同步",
      "消息订阅和客服通知"
    ]
  };
}

export function normalizeMobileInput(input = {}) {
  return {
    product: normalizeText(input.product, defaultInput.product),
    domain: normalizeText(input.domain, defaultInput.domain),
    audience: normalizeText(input.audience, defaultInput.audience),
    scene: normalizeText(input.scene, defaultInput.scene),
    timeBudget: normalizeText(input.timeBudget, defaultInput.timeBudget),
    material: normalizeText(input.material, defaultInput.material),
    publishTarget: normalizeText(input.publishTarget, defaultInput.publishTarget)
  };
}

export function buildTopRecommendations(input = {}) {
  const normalized = normalizeMobileInput(input);

  return recommendationTemplates.map((template, index) => ({
    id: template.id,
    rank: index + 1,
    label: template.label,
    title: fillTemplate(template.title, normalized),
    product: normalized.product,
    domain: normalized.domain,
    audience: normalized.audience,
    scene: normalized.scene,
    timeBudget: normalized.timeBudget,
    publishTarget: normalized.publishTarget,
    materialUsed: normalized.material,
    mobileFit: true,
    mobileReason: template.mobileReason,
    quickAction: template.quickAction,
    shareLine: `${template.shareSuffix}素材：${normalized.material}`
  }));
}

export function buildMobileActionPlan(input = {}) {
  const normalized = normalizeMobileInput(input);
  const recommendations = buildTopRecommendations(normalized);

  return {
    product: normalized.product,
    domain: normalized.domain,
    audience: normalized.audience,
    scene: normalized.scene,
    timeBudget: normalized.timeBudget,
    publishTarget: normalized.publishTarget,
    material: normalized.material,
    mobileConstraints: ["单屏优先", "少输入", "少列表", "复制即走"],
    steps: [
      {
        id: "capture",
        title: "先收短上下文",
        description: "只让用户输入产品、领域、读者、素材和目标发布位置。"
      },
      {
        id: "recommend",
        title: "只给 3 条推荐",
        description: "移动端先帮助用户选一条能立刻行动的内容，不展示完整工作台。"
      },
      {
        id: "share",
        title: "生成行动文本",
        description: "把推荐、理由和下一步压成一段可复制文本，方便发到聊天或笔记。"
      }
    ],
    recommendations
  };
}

export function buildFavoriteRecord(recommendation, options = {}) {
  if (!recommendation || !recommendation.id) {
    throw new Error("A mobile recommendation is required before saving.");
  }

  return {
    recommendationId: recommendation.id,
    title: recommendation.title,
    label: recommendation.label,
    storage: "local-demo",
    source: normalizeText(options.source, "h5-local"),
    note: normalizeText(options.note, ""),
    savedAt: new Date().toISOString()
  };
}

export function buildShareText(planInput = {}) {
  const plan = planInput.recommendations ? planInput : buildMobileActionPlan(planInput);
  const first = plan.recommendations[0];

  return [
    `今日计划：${first.title}`,
    `领域：${plan.domain}`,
    `适合读者：${plan.audience}`,
    `素材：${plan.material}`,
    `为什么现在写：${first.mobileReason}`,
    `下一步：${first.quickAction}`
  ].join("\n");
}

export function buildPublishChecklist({ route = "h5" } = {}) {
  if (route === "miniapp") {
    return {
      route: "miniapp",
      requiredChecks: [
        "小程序主体和类目",
        "审核材料",
        "用户隐私说明",
        "接口域名备案",
        "体验版测试"
      ],
      warnings: [
        "本项目当前只交付 H5 形态，小程序提交作为发布路径说明。",
        "不要把本地 demo 写成已经通过微信审核的小程序。"
      ]
    };
  }

  return {
    route: "h5",
    requiredChecks: [
      "静态页面可访问",
      "分享链接可打开",
      "移动端首屏不溢出",
      "本地收藏和复制有反馈",
      "隐私边界写清楚"
    ],
    warnings: [
      "H5 链接适合快速验证，但没有小程序的登录态和平台能力。",
      "当前 demo 不上传用户内容，不收集 openid。"
    ]
  };
}

export function buildAiPrompt({ surface = "codex-app" } = {}) {
  const common = [
    "本轮目标：开发「AI 个人效率助手」的 h5-miniapp 项目。",
    "先读 README.md、process/02-spec.md 和 test/h5-miniapp.test.js。",
    "任务是从 Web App 压缩到移动端：短输入、3 条推荐、收藏、分享文本和发布路径提示。",
    "文章和 README 要帮助读者迁移到自己的产品，不要只解释这个 demo。",
    "不要接入真实模型、登录、openid、云数据库或真实小程序上传审核。",
    "完成后运行 npm test、npm run plan、npm run share，并打开页面验证移动端首屏。"
  ];

  if (surface === "cli") {
    return [
      "在终端进入 project-vibe-lab/h5-miniapp。",
      ...common,
      "请按测试先行方式实现，最后给出命令输出和页面验证结果。"
    ].join("\n");
  }

  return [
    "打开 h5-miniapp 项目。",
    ...common,
    "请先给出计划，再小步修改文件，最后把验证结果写回 process/07-verification.md。"
  ].join("\n");
}

function normalizeText(value, fallback) {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function fillTemplate(pattern, input) {
  return pattern
    .replaceAll("{product}", input.product)
    .replaceAll("{domain}", input.domain)
    .replaceAll("{audience}", input.audience)
    .replaceAll("{timeBudget}", input.timeBudget);
}
