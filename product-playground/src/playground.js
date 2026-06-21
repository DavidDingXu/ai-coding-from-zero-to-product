const visibleStages = [
  {
    id: "first-page",
    title: "第一个网页工具",
    modulePath: "project-first-product/landing-page-tool",
    previewUrl: "http://127.0.0.1:5173",
    visibleResult: "打开页面，输入一个产品想法，生成产品简报和给 AI 的下一步提示词。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "先打开页面"
    },
    verification: "再运行 npm test，确认生成规则没有被改坏。"
  },
  {
    id: "landing",
    title: "产品官网和候补表单",
    modulePath: "project-vibe-lab/web-landing",
    previewUrl: "http://127.0.0.1:5174",
    visibleResult: "看到一个产品官网，提交空表单会报错，提交完整表单会生成本地候补记录。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "走一遍候补表单"
    },
    verification: "再运行 npm run feedback 和 npm test，确认表单数据和隐私边界。"
  },
  {
    id: "web-app",
    title: "网页应用",
    modulePath: "project-vibe-lab/web-app",
    previewUrl: "http://127.0.0.1:5175",
    visibleResult: "输入任务、日程和笔记，生成 10 张今日行动卡，并能筛选、复制、本地保存。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "生成今日行动卡"
    },
    verification: "再运行 npm run generate、npm run filter 和 npm test，确认核心数据结构。"
  },
  {
    id: "h5",
    title: "H5 / 小程序形态",
    modulePath: "project-vibe-lab/h5-miniapp",
    previewUrl: "http://127.0.0.1:5176",
    visibleResult: "在手机宽度上看到 3 条今日推荐，能收藏并复制行动文本。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "体验手机短流程"
    },
    verification: "再运行 npm run plan、npm run share 和 npm test，确认移动端取舍。"
  },
  {
    id: "extension",
    title: "浏览器插件",
    modulePath: "project-vibe-lab/browser-extension",
    previewUrl: "http://127.0.0.1:5177/popup.html",
    visibleResult: "打开插件弹窗，采集示例网页材料，生成本地读书笔记卡片。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "预览插件弹窗"
    },
    verification: "再运行 npm run manifest、npm run permissions 和 npm test，确认权限最小化。"
  },
  {
    id: "backend",
    title: "轻量后端边界",
    modulePath: "project-vibe-lab/light-backend",
    previewUrl: "http://127.0.0.1:5180",
    visibleResult: "保存一条计划草稿，看到权限矩阵和生产级缺口。",
    primaryAction: {
      kind: "open-page",
      command: "npm start",
      label: "保存一条草稿"
    },
    verification: "再运行 npm run permissions、npm run api 和 npm test，确认登录、权限和接口边界。"
  },
  {
    id: "launch",
    title: "上线和迁移",
    modulePath: "project-vibe-lab/launch-checklist",
    visibleResult: "用 7 道闸判断 demo 离小范围试用还差什么，再把反馈整理成下一轮需求。",
    primaryAction: {
      kind: "read-checklist",
      command: "npm run audit",
      label: "看哪些 gate 被拦住"
    },
    verification: "再运行 deployment、seo-analytics、payment-sandbox 和 feedback-loop 里的 audit/checklist 命令。"
  }
];

export function getVisibleProductStages() {
  return visibleStages.map((stage) => ({ ...stage, primaryAction: { ...stage.primaryAction } }));
}

export function buildLearningPath({ idea = "", audience = "" } = {}) {
  const normalizedIdea = idea.trim() || "我的第一个 AI 编程产品";
  const normalizedAudience = audience.trim() || "刚开始做产品的普通读者";

  return {
    idea: normalizedIdea,
    audience: normalizedAudience,
    summary: `围绕「${normalizedIdea}」，先看到页面或弹窗里的产品结果，再用测试、dry-run、smoke test 证明关键边界没有坏。`,
    stages: getVisibleProductStages().map((stage, index) => ({
      ...stage,
      order: index + 1,
      transferQuestion: buildTransferQuestion(stage, normalizedIdea, normalizedAudience)
    }))
  };
}

export function buildStarterPrompt(modulePath) {
  return [
    `打开 ${modulePath}。`,
    "先读 README.md 和 process/02-spec.md，帮我说清楚这个模块会让读者看到什么产品结果。",
    "先打开页面或预览入口，走一遍主路径。",
    "再运行验证命令，说明这些命令分别证明哪一层。",
    "不要只告诉我测试通过，要告诉我页面结果、用户动作、验证证据和下一步怎么改成我的产品。"
  ].join("\n");
}

function buildTransferQuestion(stage, idea, audience) {
  return `如果把这一站迁移到「${idea}」给「${audience}」使用，先改哪个字段、哪段文案或哪条用户路径？`;
}
