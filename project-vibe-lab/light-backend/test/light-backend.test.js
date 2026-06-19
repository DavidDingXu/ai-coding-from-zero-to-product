import test from "node:test";
import assert from "node:assert/strict";

import {
  authorize,
  buildAiPrompt,
  buildApiContract,
  buildAuditReport,
  buildBackendBrief,
  buildBackendDecisionGuide,
  buildDataModel,
  buildPermissionMatrix,
  buildProductionGapReport,
  createInMemoryStore,
  createSession,
  listPlanDrafts,
  normalizeDraftInput,
  resolveSession,
  savePlanDraft
} from "../src/light-backend.js";

test("buildBackendBrief keeps the backend MVP small and explicit", () => {
  const brief = buildBackendBrief();

  assert.equal(brief.productName, "AI 个人效率助手轻量后端");
  assert.equal(brief.projectId, "light-backend");
  assert.ok(brief.mvpScope.includes("模拟登录会话"));
  assert.ok(brief.mvpScope.includes("项目成员权限检查"));
  assert.ok(brief.outOfScope.includes("真实密码登录"));
  assert.ok(brief.outOfScope.includes("生产数据库连接"));
});

test("buildBackendDecisionGuide separates local demo from backend needs", () => {
  const guide = buildBackendDecisionGuide();

  assert.equal(guide[0].scenario, "个人单机 Demo");
  assert.equal(guide[0].localStorageOk, true);
  assert.equal(guide[0].backendNeeded, false);
  assert.ok(guide.find((item) => item.scenario === "保护模型 key").backendNeeded);
  assert.ok(guide.find((item) => item.scenario === "多人协作").reason.includes("谁能看"));
});

test("buildDataModel includes user session project draft and audit entities", () => {
  const model = buildDataModel();

  assert.deepEqual(Object.keys(model), ["User", "Session", "Project", "EfficiencyRecord", "AuditEvent"]);
  assert.ok(model.Session.includes("token"));
  assert.ok(model.EfficiencyRecord.includes("projectId"));
  assert.ok(model.AuditEvent.includes("actorId"));
});

test("createSession creates a demo session and rejects unknown users", () => {
  const store = createInMemoryStore();
  const session = createSession(store, { userId: "user-owner" });

  assert.equal(session.token, "demo-session-user-owner");
  assert.equal(session.role, "owner");
  assert.equal(store.sessions.length, 1);
  assert.equal(store.auditEvents[0].action, "session:create");
  assert.throws(() => createSession(store, { userId: "missing" }), /Unknown user/);
});

test("resolveSession returns anonymous when token is missing", () => {
  const store = createInMemoryStore();
  const session = resolveSession(store, "");

  assert.equal(session.authenticated, false);
  assert.equal(session.role, "anonymous");
  assert.equal(session.reason, "missing-or-expired-session");
});

test("owner can save and list drafts with audit evidence", () => {
  const store = createInMemoryStore();
  const session = createSession(store, { userId: "user-owner" });
  const saved = savePlanDraft(store, session.token, {
    title: " 轻量后端如何起步 ",
    summary: " 从保存草稿开始补登录和权限 ",
    source: "test"
  });
  const listed = listPlanDrafts(store, session.token, { projectId: "project-efficiency-lab" });

  assert.equal(saved.ok, true);
  assert.equal(saved.draft.title, "轻量后端如何起步");
  assert.equal(saved.draft.ownerId, "user-owner");
  assert.equal(listed.ok, true);
  assert.ok(listed.drafts.length >= 2);
  assert.ok(store.auditEvents.some((event) => event.action === "draft:create" && event.status === "allowed"));
  assert.ok(store.auditEvents.some((event) => event.action === "draft:list" && event.status === "allowed"));
});

test("anonymous users cannot save drafts", () => {
  const store = createInMemoryStore();
  const result = savePlanDraft(store, "", {
    title: "匿名保存",
    summary: "不应该成功"
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "missing-or-expired-session");
  assert.equal(result.draft, null);
  assert.equal(store.auditEvents.at(-1).status, "denied");
});

test("viewer can list project drafts but cannot create them", () => {
  const store = createInMemoryStore();
  const session = createSession(store, { userId: "user-viewer" });
  const listed = listPlanDrafts(store, session.token, { projectId: "project-efficiency-lab" });
  const saved = savePlanDraft(store, session.token, {
    title: "viewer 写草稿",
    summary: "不应该成功"
  });

  assert.equal(listed.ok, true);
  assert.ok(listed.drafts.length >= 1);
  assert.equal(saved.ok, false);
  assert.equal(saved.error, "role-permission-denied");
});

test("project membership blocks cross-project access", () => {
  const store = createInMemoryStore();
  const editorSession = createSession(store, { userId: "user-editor" });
  const listPrivate = listPlanDrafts(store, editorSession.token, { projectId: "project-private" });
  const auth = authorize(store, resolveSession(store, editorSession.token), "draft:create", {
    projectId: "project-private"
  });

  assert.equal(listPrivate.ok, false);
  assert.equal(listPrivate.error, "not-project-member");
  assert.equal(auth.allowed, false);
  assert.equal(auth.reason, "not-project-member");
});

test("buildPermissionMatrix separates anonymous viewer editor and owner roles", () => {
  const matrix = buildPermissionMatrix();
  const createRow = matrix.find((row) => row.action === "draft:create");
  const manageRow = matrix.find((row) => row.action === "member:manage");

  assert.equal(createRow.anonymous, "deny");
  assert.equal(createRow.viewer, "deny");
  assert.equal(createRow.editor, "allow");
  assert.equal(createRow.owner, "allow");
  assert.equal(manageRow.editor, "deny");
  assert.equal(manageRow.owner, "allow");
});

test("buildApiContract exposes routes with authentication boundaries", () => {
  const contract = buildApiContract();

  assert.deepEqual(contract.map((route) => `${route.method} ${route.path}`), [
    "GET /api/health",
    "POST /api/sessions/demo",
    "GET /api/projects/:projectId/drafts",
    "POST /api/projects/:projectId/drafts",
    "GET /api/audit"
  ]);
  assert.equal(contract.find((route) => route.path.includes("drafts") && route.method === "POST").auth, "session");
  assert.equal(contract.find((route) => route.path === "/api/audit").auth, "owner");
});

test("buildAuditReport summarizes operation evidence", () => {
  const store = createInMemoryStore();
  const session = createSession(store, { userId: "user-owner" });
  savePlanDraft(store, session.token, {});
  listPlanDrafts(store, session.token, {});
  const audit = buildAuditReport(store);

  assert.ok(audit.eventCount >= 3);
  assert.ok(audit.requiredFields.includes("resourceId"));
  assert.ok(audit.evidence.includes(`auditEvents=${store.auditEvents.length}`));
  assert.ok(audit.retention.includes("生产环境"));
});

test("buildProductionGapReport does not overclaim production readiness", () => {
  const report = buildProductionGapReport();

  assert.equal(report.currentLevel, "local-backend-mvp");
  assert.equal(report.canDemo, true);
  assert.equal(report.productionReady, false);
  assert.deepEqual(report.gaps.map((gap) => gap.id), [
    "database-migrations",
    "real-auth",
    "authorization-rbac",
    "secrets-model-proxy",
    "observability-audit",
    "privacy-data-lifecycle"
  ]);
  assert.ok(report.gaps.find((gap) => gap.id === "real-auth").required.includes("退出登录"));
});

test("normalizeDraftInput and buildAiPrompt keep the AI task bounded", () => {
  const input = normalizeDraftInput({
    projectId: " project-efficiency-lab ",
    title: " ",
    summary: " 自定义摘要 ",
    source: " codex-app "
  });
  const appPrompt = buildAiPrompt({ surface: "codex-app" });
  const cliPrompt = buildAiPrompt({ surface: "cli" });

  assert.equal(input.title, "今天先完成哪 3 件事");
  assert.equal(input.summary, "自定义摘要");
  assert.ok(appPrompt.includes("打开 light-backend 项目"));
  assert.ok(appPrompt.includes("不要接真实数据库"));
  assert.ok(cliPrompt.includes("project-vibe-lab/light-backend"));
  assert.ok(cliPrompt.includes("npm test"));
});
