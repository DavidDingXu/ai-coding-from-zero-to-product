const secretPattern = /(sk-[a-z0-9_-]{6,}|api[_-]?key|password|secret|token)/i;

export function buildLandingBrief() {
  return {
    productName: "AI 个人效率助手",
    pageGoal: "解释产品价值，并收集第一批候补用户反馈。",
    primaryAudience: "学生、上班族、产品经理、运营人员、独立开发者",
    firstPagePromise: "输入任务、日程、笔记和账目后，整理成今天能执行的计划。",
    inScope: [
      "产品一句话说明",
      "核心使用场景",
      "三步工作流",
      "候补表单",
      "本地表单校验"
    ],
    outOfScope: [
      "登录和账号体系",
      "真实模型调用",
      "远程数据库保存",
      "支付和会员系统",
      "自动发送真实提醒"
    ]
  };
}

export function buildLandingCopy() {
  return {
    hero: {
      eyebrow: "AI 个人效率助手",
      title: "把任务、日程、笔记和账目整理成今天能执行的计划",
      subtitle: "输入今天要处理的事、会议、待读内容和零散账目，先得到一份今日计划，再决定先做哪 3 件事、哪些可以推后、哪些需要补信息。",
      primaryAction: "加入候补名单",
      secondaryAction: "查看流程"
    },
    valueCards: [
      {
        title: "先把今天收拢起来",
        body: "任务、会议、笔记和账目先放进同一个入口，避免靠脑子记。"
      },
      {
        title: "每条行动有取舍依据",
        body: "行动卡片会带上类型、优先级、时间压力和下一步，方便你决定先做什么。"
      },
      {
        title: "先做今日计划，再谈复杂自动化",
        body: "第一版只做本地计划和复制，不急着接登录、提醒、支付和真实模型。"
      }
    ],
    steps: [
      "填写今天的任务、日程、笔记、账目和时间预算",
      "生成今日计划卡片，并按类型、优先级和时间筛选",
      "复制今天先做的 3 件事，后续再接模型、保存和多端形态"
    ],
    proofPoints: [
      "第一版先做官网和候补表单",
      "下一步再做网页应用里的今日计划生成",
      "真实模型、账号和数据库放到后续项目接入"
    ],
    waitlist: {
      title: "先加入候补名单",
      description: "留下你最想解决的效率问题。现在只做本地校验，不上传真实数据。",
      cta: "加入候补名单"
    }
  };
}

export function validateWaitlistInput(input = {}) {
  const errors = [];
  const normalized = normalizeWaitlistInput(input);

  if (!normalized.name) {
    errors.push("请填写称呼。");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    errors.push("请填写可联系的邮箱。");
  }
  if (!normalized.role) {
    errors.push("请说明你的角色。");
  }
  if (!normalized.scenario) {
    errors.push("请填写你关注的效率场景。");
  }
  if (normalized.pain.length < 8) {
    errors.push("请用一句话说明你现在最卡的效率问题。");
  }
  if (secretPattern.test(Object.values(normalized).join(" "))) {
    errors.push("不要在反馈里填写 API Key、密码或其他密钥。");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: normalized
  };
}

export function buildFeedbackRecord(input = {}) {
  const result = validateWaitlistInput(input);
  if (!result.ok) {
    return {
      ok: false,
      storage: "local-demo",
      errors: result.errors
    };
  }

  return {
    ok: true,
    storage: "local-demo",
    note: "当前 demo 只在本地页面展示结果，不上传远程服务。",
    ...result.value
  };
}

export function buildLaunchChecklist() {
  return [
    {
      id: "page-message",
      title: "页面一句话能讲清产品",
      check: "首屏能看懂目标用户、解决问题和第一版能力。",
      done: false
    },
    {
      id: "form-validation",
      title: "候补表单能阻止明显错误",
      check: "空称呼、错误邮箱、缺少角色、密钥类文本都要提示。",
      done: false
    },
    {
      id: "privacy-boundary",
      title: "隐私边界写在页面和 README 里",
      check: "当前只做本地 demo，不写远程数据库，不要求填写密钥。",
      done: false
    },
    {
      id: "local-verification",
      title: "本地页面和测试都能跑",
      check: "执行 npm test，并用 npm start 打开页面试一次表单。",
      done: false
    },
    {
      id: "next-step",
      title: "下一步能自然进入网页应用",
      check: "官网只收集意向，今日计划生成放到第 19 篇。",
      done: false
    }
  ];
}

export function buildAiPrompt({ surface = "codex-app" } = {}) {
  const common = [
    "本轮目标：开发「AI 个人效率助手」的 web-landing 官网项目。",
    "先读 README.md 和 process/02-spec.md，再看 test/landing-page.test.js。",
    "只做官网、候补表单、本地校验和页面内反馈。",
    "不要接入真实模型、登录、真实提醒、支付或远程数据库。",
    "完成后运行 npm test，并用 npm start 打开页面验证表单。"
  ];

  if (surface === "cli") {
    return [
      "在终端进入 project-vibe-lab/web-landing。",
      ...common,
      "请按测试先行方式实现，最后给出 npm test 和页面验证结果。"
    ].join("\n");
  }

  return [
    "打开 web-landing 项目。",
    ...common,
    "请先给出计划，再小步修改文件，最后把验证结果写回 process/07-verification.md。"
  ].join("\n");
}

export function normalizeWaitlistInput(input = {}) {
  return {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim().toLowerCase(),
    role: String(input.role ?? "").trim(),
    scenario: String(input.scenario ?? "").trim(),
    pain: String(input.pain ?? "").trim()
  };
}
