const defaultUsers = [
  {
    id: "user-owner",
    name: "林晓",
    role: "owner",
    email: "owner@example.com"
  },
  {
    id: "user-editor",
    name: "周舟",
    role: "editor",
    email: "editor@example.com"
  },
  {
    id: "user-viewer",
    name: "陈宁",
    role: "viewer",
    email: "viewer@example.com"
  }
];

const defaultProjects = [
  {
    id: "project-efficiency-lab",
    name: "AI 个人效率助手",
    ownerId: "user-owner",
    memberIds: ["user-owner", "user-editor", "user-viewer"]
  },
  {
    id: "project-private",
    name: "私有计划库",
    ownerId: "user-owner",
    memberIds: ["user-owner"]
  }
];

const defaultDrafts = [
  {
    id: "draft-seed-001",
    projectId: "project-efficiency-lab",
    ownerId: "user-owner",
    title: "今天先完成哪 3 件事",
    summary: "把任务、日程、笔记和账目整理成今日计划。",
    status: "draft",
    source: "seed",
    createdAt: "2026-06-11T09:00:00.000Z",
    updatedAt: "2026-06-11T09:00:00.000Z"
  }
];

const rolePermissions = {
  anonymous: [],
  viewer: ["draft:list"],
  editor: ["draft:list", "draft:create", "draft:update"],
  owner: ["draft:list", "draft:create", "draft:update", "draft:delete", "member:manage"]
};

export function buildBackendBrief() {
  return {
    productName: "AI 个人效率助手轻量后端",
    projectId: "light-backend",
    goal: "让官网、网页应用、H5/小程序形态和插件有统一的数据保存、登录会话和权限边界。",
    currentLevel: "local-backend-mvp",
    mvpScope: [
      "本地内存数据源",
      "模拟登录会话",
      "项目成员权限检查",
      "效率记录保存和查询",
      "API 合同",
      "审计事件",
      "生产级升级缺口"
    ],
    outOfScope: [
      "真实密码登录",
      "OAuth 或短信登录",
      "生产数据库连接",
      "真实模型 key 代理",
      "支付、扣费和用户隐私数据处理"
    ],
    productionUpgrade: [
      "数据库迁移、备份和回滚",
      "真实登录、会话续期和退出",
      "基于角色和资源的权限系统",
      "服务端模型代理、额度和限流",
      "审计日志、告警和数据生命周期"
    ]
  };
}

export function buildBackendDecisionGuide() {
  return [
    {
      scenario: "个人单机 Demo",
      localStorageOk: true,
      backendNeeded: false,
      reason: "只有一个人、一个浏览器、没有登录和团队协作时，本地保存足够演示。"
    },
    {
      scenario: "跨设备继续使用",
      localStorageOk: false,
      backendNeeded: true,
      reason: "用户在手机和电脑之间切换，需要服务端保存数据。"
    },
    {
      scenario: "多人协作",
      localStorageOk: false,
      backendNeeded: true,
      reason: "需要知道谁创建、谁能看、谁能改，以及冲突如何处理。"
    },
    {
      scenario: "保护模型 key",
      localStorageOk: false,
      backendNeeded: true,
      reason: "模型 key 不能放在浏览器、插件或 App 客户端里。"
    },
    {
      scenario: "商业化和审计",
      localStorageOk: false,
      backendNeeded: true,
      reason: "额度、订单、权限、日志和数据删除都需要服务端兜住。"
    }
  ];
}

export function buildDataModel() {
  return {
    User: ["id", "name", "email", "role"],
    Session: ["token", "userId", "role", "expiresAt", "createdAt"],
    Project: ["id", "name", "ownerId", "memberIds"],
    EfficiencyRecord: ["id", "projectId", "ownerId", "title", "summary", "status", "source", "createdAt", "updatedAt"],
    AuditEvent: ["id", "actorId", "action", "resourceType", "resourceId", "status", "reason", "createdAt"]
  };
}

export function createInMemoryStore(seed = {}) {
  return {
    users: clone(seed.users || defaultUsers),
    projects: clone(seed.projects || defaultProjects),
    drafts: clone(seed.drafts || defaultDrafts),
    sessions: clone(seed.sessions || []),
    auditEvents: clone(seed.auditEvents || [])
  };
}

export function createSession(store = createInMemoryStore(), options = {}) {
  const userId = normalizeText(options.userId, "user-owner");
  const user = store.users.find((item) => item.id === userId);
  if (!user) {
    throw new Error(`Unknown user: ${userId}`);
  }

  const session = {
    token: `demo-session-${user.id}`,
    userId: user.id,
    role: user.role,
    createdAt: "2026-06-11T09:30:00.000Z",
    expiresAt: "2026-06-11T21:30:00.000Z",
    warning: "local-demo-session-only"
  };
  store.sessions = store.sessions.filter((item) => item.userId !== user.id).concat(session);
  appendAuditEvent(store, {
    actorId: user.id,
    action: "session:create",
    resourceType: "Session",
    resourceId: session.token,
    status: "allowed",
    reason: "demo-login"
  });
  return { ...session };
}

export function resolveSession(store = createInMemoryStore(), token = "") {
  const session = store.sessions.find((item) => item.token === token);
  if (!session) {
    return {
      authenticated: false,
      userId: "anonymous",
      role: "anonymous",
      reason: "missing-or-expired-session"
    };
  }
  const user = store.users.find((item) => item.id === session.userId);
  if (!user) {
    return {
      authenticated: false,
      userId: "anonymous",
      role: "anonymous",
      reason: "session-user-not-found"
    };
  }
  return {
    authenticated: true,
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    token: session.token
  };
}

export function authorize(store = createInMemoryStore(), sessionOrToken = "", action = "", resource = {}) {
  const session = typeof sessionOrToken === "string" ? resolveSession(store, sessionOrToken) : sessionOrToken;
  const permissions = rolePermissions[session.role] || [];

  if (!session.authenticated) {
    return {
      allowed: false,
      role: "anonymous",
      reason: session.reason || "not-authenticated"
    };
  }

  if (!permissions.includes(action)) {
    return {
      allowed: false,
      role: session.role,
      reason: "role-permission-denied"
    };
  }

  if (resource.projectId) {
    const project = store.projects.find((item) => item.id === resource.projectId);
    if (!project) {
      return {
        allowed: false,
        role: session.role,
        reason: "project-not-found"
      };
    }
    if (!project.memberIds.includes(session.userId)) {
      return {
        allowed: false,
        role: session.role,
        reason: "not-project-member"
      };
    }
  }

  if (action === "member:manage") {
    const project = store.projects.find((item) => item.id === resource.projectId);
    if (project && project.ownerId !== session.userId) {
      return {
        allowed: false,
        role: session.role,
        reason: "only-owner-can-manage-members"
      };
    }
  }

  return {
    allowed: true,
    role: session.role,
    reason: "allowed"
  };
}

export function savePlanDraft(store = createInMemoryStore(), sessionToken = "", input = {}) {
  const draftInput = normalizeDraftInput(input);
  const session = resolveSession(store, sessionToken);
  const auth = authorize(store, session, "draft:create", { projectId: draftInput.projectId });

  if (!auth.allowed) {
    appendAuditEvent(store, {
      actorId: session.userId,
      action: "draft:create",
      resourceType: "EfficiencyRecord",
      resourceId: draftInput.projectId,
      status: "denied",
      reason: auth.reason
    });
    return {
      ok: false,
      error: auth.reason,
      draft: null
    };
  }

  const now = "2026-06-11T10:00:00.000Z";
  const draft = {
    id: `draft-${String(store.drafts.length + 1).padStart(3, "0")}`,
    projectId: draftInput.projectId,
    ownerId: session.userId,
    title: draftInput.title,
    summary: draftInput.summary,
    status: "draft",
    source: draftInput.source,
    createdAt: now,
    updatedAt: now
  };
  store.drafts.push(draft);
  appendAuditEvent(store, {
    actorId: session.userId,
    action: "draft:create",
    resourceType: "EfficiencyRecord",
    resourceId: draft.id,
    status: "allowed",
    reason: "saved-local-draft"
  });

  return {
    ok: true,
    draft: { ...draft }
  };
}

export function listPlanDrafts(store = createInMemoryStore(), sessionToken = "", options = {}) {
  const projectId = normalizeText(options.projectId, "project-efficiency-lab");
  const session = resolveSession(store, sessionToken);
  const auth = authorize(store, session, "draft:list", { projectId });

  if (!auth.allowed) {
    appendAuditEvent(store, {
      actorId: session.userId,
      action: "draft:list",
      resourceType: "Project",
      resourceId: projectId,
      status: "denied",
      reason: auth.reason
    });
    return {
      ok: false,
      error: auth.reason,
      drafts: []
    };
  }

  const drafts = store.drafts
    .filter((draft) => draft.projectId === projectId)
    .map((draft) => ({ ...draft }));

  appendAuditEvent(store, {
    actorId: session.userId,
    action: "draft:list",
    resourceType: "Project",
    resourceId: projectId,
    status: "allowed",
    reason: `returned-${drafts.length}-drafts`
  });

  return {
    ok: true,
    drafts
  };
}

export function buildPermissionMatrix() {
  const actions = [
    { action: "draft:list", label: "查看效率记录" },
    { action: "draft:create", label: "创建效率记录" },
    { action: "draft:update", label: "编辑效率记录" },
    { action: "draft:delete", label: "删除效率记录" },
    { action: "member:manage", label: "管理成员" }
  ];
  const roles = ["anonymous", "viewer", "editor", "owner"];

  return actions.map((item) => {
    const row = { ...item };
    for (const role of roles) {
      row[role] = rolePermissions[role].includes(item.action) ? "allow" : "deny";
    }
    return row;
  });
}

export function buildApiContract() {
  return [
    {
      method: "GET",
      path: "/api/health",
      auth: "none",
      purpose: "让前端、部署平台和监控检查服务是否活着。",
      response: ["status", "version", "time"]
    },
    {
      method: "POST",
      path: "/api/sessions/demo",
      auth: "demo-only",
      purpose: "本地演示登录，生产环境必须替换为真实登录。",
      request: ["userId"],
      response: ["token", "userId", "role", "expiresAt"]
    },
    {
      method: "GET",
      path: "/api/projects/:projectId/drafts",
      auth: "session",
      purpose: "列出当前项目效率记录，只允许项目成员访问。",
      response: ["drafts"]
    },
    {
      method: "POST",
      path: "/api/projects/:projectId/drafts",
      auth: "session",
      purpose: "创建效率记录，记录创建人和审计事件。",
      request: ["title", "summary", "source"],
      response: ["draft"]
    },
    {
      method: "GET",
      path: "/api/audit",
      auth: "owner",
      purpose: "查看关键操作审计事件，生产环境要落到数据库或日志系统。",
      response: ["events"]
    }
  ];
}

export function buildAuditReport(store = createInMemoryStore()) {
  return {
    eventCount: store.auditEvents.length,
    requiredFields: buildDataModel().AuditEvent,
    lastEvents: store.auditEvents.slice(-5).map((event) => ({ ...event })),
    retention: "本地 MVP 只保存在内存里；生产环境至少要持久化、脱敏、可检索，并设置保留周期。",
    evidence: [
      `users=${store.users.length}`,
      `projects=${store.projects.length}`,
      `drafts=${store.drafts.length}`,
      `auditEvents=${store.auditEvents.length}`
    ]
  };
}

export function buildProductionGapReport() {
  return {
    currentLevel: "local-backend-mvp",
    canDemo: true,
    productionReady: false,
    upgradePath: [
      "MVP：本地内存、模拟登录、权限函数、API 合同",
      "Beta：真实数据库、真实登录、服务端模型代理、基础日志",
      "Production：迁移回滚、备份恢复、RBAC、限流、审计、隐私和告警"
    ],
    gaps: [
      {
        id: "database-migrations",
        title: "数据库、迁移和备份",
        current: "内存数组和种子数据",
        required: ["Postgres 或托管数据库", "schema migration", "备份恢复", "回滚脚本"],
        riskIfIgnored: "重启丢数据，字段变化不可控，线上无法恢复。"
      },
      {
        id: "real-auth",
        title: "真实登录和会话",
        current: "demo token",
        required: ["密码或第三方登录", "session 续期", "退出登录", "设备管理"],
        riskIfIgnored: "任何人都可能伪造用户身份。"
      },
      {
        id: "authorization-rbac",
        title: "资源级权限",
        current: "角色 + 项目成员检查",
        required: ["角色矩阵", "资源归属", "越权测试", "管理后台"],
        riskIfIgnored: "用户可能看到或修改别人的数据。"
      },
      {
        id: "secrets-model-proxy",
        title: "密钥和模型代理",
        current: "没有接真实模型",
        required: ["服务端代理", "模型 key 托管", "额度", "限流", "结构化输出校验"],
        riskIfIgnored: "客户端泄露 key，成本失控，输出无法被后端稳定消费。"
      },
      {
        id: "observability-audit",
        title: "日志、审计和告警",
        current: "内存审计事件",
        required: ["请求日志", "错误日志", "审计查询", "告警", "traceId"],
        riskIfIgnored: "线上出错后无法定位是谁、在什么时候、改了什么。"
      },
      {
        id: "privacy-data-lifecycle",
        title: "隐私和数据生命周期",
        current: "演示数据",
        required: ["隐私声明", "数据导出", "删除账号", "敏感字段脱敏", "访问留痕"],
        riskIfIgnored: "用户数据处理没有边界，后续商业化会被卡住。"
      }
    ]
  };
}

export function buildAiPrompt(options = {}) {
  const surface = normalizeText(options.surface, "codex-app");
  if (surface === "cli") {
    return [
      "cd projects/ai-coding-from-zero-to-product/project-vibe-lab/light-backend",
      "先运行 npm test。",
      "本轮目标：补齐轻量后端的 API 合同、模拟登录、权限检查、效率记录保存、审计事件和生产级缺口。",
      "不要接真实数据库、真实密码登录、真实模型 key 或支付能力。",
      "完成后运行 npm test、npm run save、npm run list、npm run permissions、npm run production。"
    ].join("\n");
  }

  return [
    "打开 light-backend 项目。",
    "先读 README.md、process/02-spec.md 和 test/light-backend.test.js。",
    "请把这个项目作为 AI 个人效率助手的轻量后端 MVP：模拟登录、按项目成员做权限检查、保存效率记录、输出 API 合同和审计报告。",
    "第一版不要接真实数据库、真实密码登录、真实模型 key、支付或用户隐私数据。",
    "完成后运行 npm test、npm run save、npm run list、npm run permissions、npm run api、npm run production，并打开本地页面验证。"
  ].join("\n");
}

export function normalizeDraftInput(input = {}) {
  return {
    projectId: normalizeText(input.projectId, "project-efficiency-lab"),
    title: normalizeText(input.title, "今天先完成哪 3 件事"),
    summary: normalizeText(input.summary, "用 AI 个人效率助手说明数据库、登录、权限和审计什么时候进入产品。"),
    source: normalizeText(input.source, "local-demo")
  };
}

function appendAuditEvent(store, event) {
  const createdAt = "2026-06-11T10:00:00.000Z";
  store.auditEvents.push({
    id: `audit-${String(store.auditEvents.length + 1).padStart(3, "0")}`,
    actorId: event.actorId || "anonymous",
    action: event.action,
    resourceType: event.resourceType,
    resourceId: event.resourceId,
    status: event.status,
    reason: event.reason,
    createdAt
  });
}

function normalizeText(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized || fallback;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
