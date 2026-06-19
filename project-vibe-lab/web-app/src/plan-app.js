const defaultInput = {
  domain: "工作和学习",
  audience: "想提升效率的普通用户",
  goal: "整理今天最该完成的 3 件事",
  tone: "今日计划",
  constraints: "先用本地 demo 验证，不接真实模型和数据库"
};

const actionCardTemplates = [
  {
    type: "task",
    stage: "start",
    difficulty: "easy",
    angle: "立刻推进",
    pattern: "先把「{domain}」里最影响今天结果的一件事写成 25 分钟任务",
    nextAction: "写下完成标准、预计时间和第一步动作，先做一轮 25 分钟。"
  },
  {
    type: "schedule",
    stage: "start",
    difficulty: "easy",
    angle: "时间锚点",
    pattern: "把今天固定日程前后的空档整理成两段可用时间",
    nextAction: "先标出不能移动的会议，再给每段空档安排一个明确动作。"
  },
  {
    type: "task",
    stage: "decision",
    difficulty: "easy",
    angle: "防失控",
    pattern: "{audience}今天只保留 3 件必须完成的事，其他先放到待处理区",
    nextAction: "把每件事标成必须、应该、可以推后，先处理必须项。"
  },
  {
    type: "note",
    stage: "decision",
    difficulty: "medium",
    angle: "笔记沉淀",
    pattern: "把今天读到的一条「{domain}」材料整理成可复用笔记",
    nextAction: "只保留来源、3 个要点、一个可执行动作，不写长篇读后感。"
  },
  {
    type: "task",
    stage: "build",
    difficulty: "medium",
    angle: "跟练",
    pattern: "把「{goal}」拆成今天可以完成的一张行动卡",
    nextAction: "写清输入、动作、完成证据和失败后怎么降级。"
  },
  {
    type: "checklist",
    stage: "build",
    difficulty: "medium",
    angle: "验证",
    pattern: "AI 生成今日计划后，{audience}怎么判断它不是空话",
    nextAction: "检查每条计划是否有动作、时间、完成标准和下一步。"
  },
  {
    type: "budget",
    stage: "build",
    difficulty: "hard",
    angle: "轻量记账",
    pattern: "今天的零散支出先记成 3 类：必要、可减少、待确认",
    nextAction: "先记录金额、用途和是否重复出现，不接真实支付或银行卡。"
  },
  {
    type: "note",
    stage: "improve",
    difficulty: "medium",
    angle: "保存",
    pattern: "把今天的计划保存下来：先用本地存储做一个可验证版本",
    nextAction: "定义保存字段、隐私提示和清空数据入口，不把密钥写进页面。"
  },
  {
    type: "checklist",
    stage: "improve",
    difficulty: "hard",
    angle: "质量",
    pattern: "{domain}助手上线前，最容易漏掉的输入校验和隐私边界",
    nextAction: "把敏感信息、空输入、重复保存和失败提示都写进检查清单。"
  },
  {
    type: "checklist",
    stage: "improve",
    difficulty: "hard",
    angle: "迁移",
    pattern: "把「{domain}」效率助手改成自己的产品，要先替换哪些上下文",
    nextAction: "替换目标用户、记录类型、输出格式和隐私边界，再重新跑生成与筛选。"
  }
];

export function buildAppBrief() {
  return {
    productName: "AI 个人效率助手",
    projectId: "web-app",
    pageGoal: "把官网里的产品承诺推进到可交互的今日计划页面。",
    primaryAudience: "学生、上班族、产品经理、运营人员、独立开发者和 AI 编程初学者",
    firstPagePromise: "输入任务、日程、笔记和账目，生成 10 张今日行动卡，并支持筛选、复制和本地保存。",
    inScope: [
      "记录任务、日程、笔记和账目",
      "生成今日计划",
      "按类型和优先级筛选",
      "复制单个行动卡",
      "本地保存计划记录",
      "给出验证检查清单"
    ],
    outOfScope: [
      "真实模型调用",
      "账号体系和远程数据库",
      "团队协作",
      "自动发送真实提醒",
      "支付和额度系统"
    ]
  };
}

export function normalizePlanInput(input = {}) {
  return {
    domain: normalizeText(input.domain, defaultInput.domain),
    audience: normalizeText(input.audience, defaultInput.audience),
    goal: normalizeText(input.goal, defaultInput.goal),
    tone: normalizeText(input.tone, defaultInput.tone),
    constraints: normalizeText(input.constraints, defaultInput.constraints)
  };
}

export function generateActionCards(input = {}) {
  const normalized = normalizePlanInput(input);

  return actionCardTemplates.map((template, index) => {
    const title = fillTemplate(template.pattern, normalized);
    const score = 92 - index * 4 + (template.difficulty === "easy" ? 3 : 0);

    return {
      id: `plan-${String(index + 1).padStart(2, "0")}`,
      rank: index + 1,
      title,
      audience: normalized.audience,
      domain: normalized.domain,
      goal: normalized.goal,
      tone: normalized.tone,
      constraints: normalized.constraints,
      type: template.type,
      stage: template.stage,
      difficulty: template.difficulty,
      angle: template.angle,
      score,
      tags: buildTags(template, normalized),
      reason: buildReason(template, normalized),
      nextAction: template.nextAction
    };
  });
}

export function filterActionCards(cards = [], filters = {}) {
  return cards.filter((card) => {
    if (filters.difficulty && card.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.type && card.type !== filters.type) {
      return false;
    }
    if (filters.stage && card.stage !== filters.stage) {
      return false;
    }
    return true;
  });
}

export function buildSavedActionCardRecord(card, options = {}) {
  if (!card || !card.id) {
    throw new Error("A planning card with id is required before saving.");
  }

  return {
    cardId: card.id,
    title: card.title,
    difficulty: card.difficulty,
    type: card.type,
    stage: card.stage,
    score: card.score,
    storage: "local-demo",
    source: normalizeText(options.source, "browser-local"),
    note: normalizeText(options.note, ""),
    savedAt: new Date().toISOString()
  };
}

export function buildPlanPrompt(input = {}) {
  const normalized = normalizePlanInput(input);

  return [
    "我要在「AI 个人效率助手」web-app 里生成今日计划。",
    `场景：${normalized.domain}`,
    `目标用户：${normalized.audience}`,
    `今日目标：${normalized.goal}`,
    `表达场景：${normalized.tone}`,
    `约束：${normalized.constraints}`,
    "请先输出 10 张行动卡，每张卡包含标题、适合人群、类型、优先级、推荐理由和下一步动作。",
    "本轮不要接入真实模型、账号体系、远程数据库或支付。先保证本地生成、筛选、复制和保存可验证。"
  ].join("\n");
}

export function buildLaunchChecklist() {
  return [
    {
      id: "plan-generation",
      title: "能生成 10 张今日行动卡",
      check: "输入场景、目标用户和今日目标后，页面与 CLI 都能得到 10 条结构化结果。",
      done: false
    },
    {
      id: "plan-filtering",
      title: "筛选不会破坏原始列表",
      check: "按优先级、类型和目标阶段筛选后，原始 10 条仍然保留。",
      done: false
    },
    {
      id: "copy-and-save",
      title: "复制和本地保存路径清楚",
      check: "用户能复制单张行动卡，也能把今日计划保存到本地记录。",
      done: false
    },
    {
      id: "privacy-boundary",
      title: "页面不收集密钥和远程账号信息",
      check: "当前版本只做本地 demo，不要求 API Key，不上传用户内容。",
      done: false
    },
    {
      id: "local-verification",
      title: "测试、CLI 和浏览器都能验证",
      check: "至少跑 npm test、npm run generate、npm run filter 和浏览器点击。",
      done: false
    }
  ];
}

export function buildAiPrompt({ surface = "codex-app" } = {}) {
  const common = [
    "本轮目标：开发「AI 个人效率助手」的 web-app 项目。",
    "先读 README.md、process/02-spec.md 和 test/plan-app.test.js。",
    "只做今日计划生成、筛选、复制和本地保存。",
    "不要接入真实模型、登录、真实提醒、支付或远程数据库。",
    "完成后运行 npm test、npm run generate、npm run filter，并打开页面验证。"
  ];

  if (surface === "cli") {
    return [
      "在终端进入 project-vibe-lab/web-app。",
      ...common,
      "请按测试先行方式实现，最后给出命令输出和页面验证结果。"
    ].join("\n");
  }

  return [
    "打开 web-app 项目。",
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
    .replaceAll("{domain}", input.domain)
    .replaceAll("{audience}", input.audience)
    .replaceAll("{goal}", input.goal);
}

function buildTags(template, input) {
  return [input.domain, input.audience, template.type, template.difficulty, template.stage];
}

function buildReason(template, input) {
  const stageLabel = {
    start: "适合放在入门阶段，先降低读者动手门槛。",
    decision: "适合帮助读者做取舍，避免第一版范围失控。",
    build: "适合进入跟练过程，让读者看到输入、改动和验证。",
    improve: "适合在已有 demo 上补保存、质量和迁移。"
  }[template.stage];

  return `${stageLabel}它服务于“${input.goal}”，并且能把「${input.domain}」的抽象想法落到「${input.audience}」能执行的下一步。`;
}
