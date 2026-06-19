export const SAMPLE_FEEDBACK = [
  {
    id: "fb_001",
    channel: "wechat",
    user: "trial-user-01",
    rawText: "生成结果还可以，但是我找不到保存入口，退出页面后怕找不回来。",
    receivedAt: "2026-06-12T09:10:00+08:00"
  },
  {
    id: "fb_002",
    channel: "form",
    user: "trial-user-02",
    rawText: "我想知道输入的产品方向会不会被保存到云端，页面没有说清楚。",
    receivedAt: "2026-06-12T10:20:00+08:00"
  },
  {
    id: "fb_003",
    channel: "pricing-click",
    user: "trial-user-03",
    rawText: "个人版 19 元到底包含多少次生成？如果不满意能不能退？",
    receivedAt: "2026-06-12T11:30:00+08:00"
  },
  {
    id: "fb_004",
    channel: "error-report",
    user: "trial-user-04",
    rawText: "我点复制后没有任何提示，不确定有没有复制成功。",
    receivedAt: "2026-06-12T14:05:00+08:00"
  },
  {
    id: "fb_005",
    channel: "wechat",
    user: "trial-user-05",
    rawText: "后面能不能支持团队空间？我们团队想一起看计划。",
    receivedAt: "2026-06-12T16:40:00+08:00"
  }
];

export const FEEDBACK_LOOP_EVIDENCE = [
  "raw-feedback",
  "classification",
  "fact-extraction",
  "spec-update",
  "task-queue",
  "verification-plan",
  "user-reply"
];

export function buildFeedbackBrief() {
  return {
    product: "AI 个人效率助手",
    article: 26,
    goal: "把用户反馈转成事实、判断、spec、task 和下一轮验证，让反馈真正进入 AI 编程流程",
    outOfScope: ["不把单条反馈直接当需求", "不直接让 AI 改代码", "不承诺每条反馈都会做", "不把反馈整理写成客服话术"],
    inputs: ["raw feedback", "usage metrics", "current spec", "verification evidence"]
  };
}

export function normalizeFeedbackInbox(feedback = SAMPLE_FEEDBACK) {
  return feedback.map((item, index) => ({
    id: item.id || `fb_${String(index + 1).padStart(3, "0")}`,
    channel: item.channel || "unknown",
    user: item.user || "anonymous",
    rawText: normalize(item.rawText),
    receivedAt: item.receivedAt || "2026-06-12T00:00:00+08:00"
  }));
}

export function classifyFeedback(feedback = SAMPLE_FEEDBACK) {
  return normalizeFeedbackInbox(feedback).map((item) => {
    if (item.rawText.includes("保存入口")) return withClass(item, "usability", 5);
    if (item.rawText.includes("云端") || item.rawText.includes("保存到")) return withClass(item, "trust", 4);
    if (item.rawText.includes("19 元") || item.rawText.includes("退")) return withClass(item, "commercial", 4);
    if (item.rawText.includes("复制")) return withClass(item, "bug", 3);
    return withClass(item, "feature-request", 2);
  });
}

export function extractFeedbackFacts(feedback = SAMPLE_FEEDBACK) {
  return classifyFeedback(feedback).map((item) => {
    const mapping = factMap(item);
    return {
      id: item.id,
      type: item.type,
      fact: mapping.fact,
      judgment: mapping.judgment,
      assumption: mapping.assumption,
      needsEvidence: mapping.needsEvidence
    };
  });
}

export function buildSpecFromFeedback(feedback = SAMPLE_FEEDBACK) {
  const facts = extractFeedbackFacts(feedback);
  return {
    title: "让用户更容易保存和带走生成结果",
    problem: "小范围试用反馈显示，用户找不到保存入口，也不确定复制是否成功；保存和带走结果的路径会影响首次价值。",
    scope: ["保存入口", "复制反馈", "隐私提示", "个人版权益说明"],
    nonGoals: ["不新增团队空间", "不新增批量生成", "不接生产支付通道"],
    evidence: facts.map((item) => ({ id: item.id, fact: item.fact, type: item.type })),
    acceptanceCriteria: [
      "生成结果卡片上必须出现保存按钮",
      "点击复制后必须出现成功或失败提示",
      "输入区域旁必须有保存位置和删除方式说明",
      "个人版说明必须包含额度、历史记录和退款边界"
    ]
  };
}

export function buildTaskQueue(feedback = SAMPLE_FEEDBACK) {
  const spec = buildSpecFromFeedback(feedback);
  return [
    {
      id: "save-entry",
      source: "fb_001",
      title: "让保存入口出现在生成结果卡片上",
      verification: [spec.acceptanceCriteria[0], "savedRate 继续记录"],
      prompt: "只处理 save-entry。先读 spec 和测试，给生成结果卡片增加保存入口和验证，不要扩大范围。"
    },
    {
      id: "copy-format",
      source: "fb_004",
      title: "复制后给出明确反馈，并优化复制文本格式",
      verification: [spec.acceptanceCriteria[1], "copy action 有成功或失败状态"],
      prompt: "只处理 copy-format。补复制反馈和测试，不要扩大范围。"
    },
    {
      id: "privacy-hint",
      source: "fb_002",
      title: "在输入区补保存位置和删除方式说明",
      verification: [spec.acceptanceCriteria[2], "隐私页链接可访问"],
      prompt: "只处理 privacy-hint。补输入区隐私提示和隐私页链接，不要扩大范围。"
    },
    {
      id: "payment-copy",
      source: "fb_003",
      title: "收紧个人版权益和退款边界文案",
      verification: [spec.acceptanceCriteria[3], "价格页包含额度和退款边界"],
      prompt: "只处理 payment-copy。补个人版权益文案和验证，不要扩大范围。"
    }
  ];
}

export function auditFeedbackLoop(input = {}) {
  const evidence = new Set(input.evidence || []);
  const missing = FEEDBACK_LOOP_EVIDENCE.filter((item) => !evidence.has(item));
  return {
    status: missing.length === 0 ? "ready-for-next-iteration" : "blocked",
    missing,
    provided: FEEDBACK_LOOP_EVIDENCE.filter((item) => evidence.has(item)),
    message: missing.length === 0
      ? "反馈闭环证据齐全，可以进入下一轮小任务开发"
      : "先补齐原始反馈、分类、事实提取、spec 更新、任务队列、验证计划和用户回复"
  };
}

export function buildFeedbackChecklist() {
  return [
    { id: "capture", check: "保留原始反馈、渠道、时间和用户标识", evidence: ["raw-feedback"] },
    { id: "classify", check: "把反馈分成 bug、易用性、信任、商业和功能请求", evidence: ["classification", "fact-extraction"] },
    { id: "spec", check: "把高优先级反馈写进 spec，明确范围和非目标", evidence: ["spec-update"] },
    { id: "tasks", check: "把 spec 拆成小任务，每个任务只处理一个改动", evidence: ["task-queue"] },
    { id: "verify", check: "每个任务都有页面、测试、指标或文案验证", evidence: ["verification-plan"] },
    { id: "reply", check: "给反馈用户一个真实回复，不承诺没排期的功能", evidence: ["user-reply"] }
  ];
}

export function buildAiPrompt(input = {}) {
  const product = normalize(input.product || "AI 个人效率助手");
  return [
    "打开 project-vibe-lab/feedback-loop 项目。",
    "先读 README.md、process/02-spec.md 和 test/feedback-loop.test.js。",
    `请把我的产品「${product}」的小范围试用反馈整理成下一轮 AI 编程任务。`,
    "必须保留原始反馈，先分类，再提取事实、判断和假设，然后更新 spec，最后拆成小任务和验证方式。",
    "输出证据缺口、spec 草稿、任务队列、验证计划和给用户的回复要点。",
    "不要直接改代码，不要把单条反馈直接当需求，不要承诺没有排期的功能。"
  ].join("\n");
}

function withClass(item, type, severity) {
  return { ...item, type, severity };
}

function factMap(item) {
  const maps = {
    usability: {
      fact: "用户找不到保存入口",
      judgment: "保存路径影响首次价值",
      assumption: "结果卡片上的保存入口不够明显",
      needsEvidence: ["savedRate", "结果卡片截图", "保存按钮点击事件"]
    },
    trust: {
      fact: "用户不知道输入内容是否会保存到云端",
      judgment: "信任信息不足会阻碍继续使用",
      assumption: "输入区和隐私页没有讲清保存位置",
      needsEvidence: ["隐私页链接", "输入区提示", "数据保存策略"]
    },
    commercial: {
      fact: "用户不清楚个人版额度和退款边界",
      judgment: "价格页文案影响支付意向",
      assumption: "权益、额度和退款说明不够具体",
      needsEvidence: ["价格页截图", "套餐说明", "退款文案"]
    },
    bug: {
      fact: "用户点击复制后没有得到反馈",
      judgment: "复制状态不清楚会降低带走结果的意愿",
      assumption: "复制成功和失败状态没有可见提示",
      needsEvidence: ["copy event", "toast 状态", "浏览器剪贴板行为"]
    },
    "feature-request": {
      fact: "用户提出团队空间需求",
      judgment: "团队协作有潜在价值，但不适合立刻进入当前迭代",
      assumption: "当前小范围试用还没有足够团队使用证据",
      needsEvidence: ["团队用户数量", "协作场景访谈", "权限和额度设计"]
    }
  };
  return maps[item.type] || maps["feature-request"];
}

function normalize(value) {
  return String(value || "").trim();
}
