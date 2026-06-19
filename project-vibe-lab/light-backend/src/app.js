import {
  buildBackendDecisionGuide,
  buildPermissionMatrix,
  buildProductionGapReport,
  createInMemoryStore,
  createSession,
  listPlanDrafts,
  savePlanDraft
} from "./light-backend.js";

const titleInput = document.querySelector("#titleInput");
const summaryInput = document.querySelector("#summaryInput");
const saveButton = document.querySelector("#saveButton");
const sessionStatus = document.querySelector("#sessionStatus");
const decisionList = document.querySelector("#decisionList");
const draftList = document.querySelector("#draftList");
const permissionTable = document.querySelector("#permissionTable");
const gapList = document.querySelector("#gapList");

const store = createInMemoryStore();
const session = createSession(store, { userId: "user-owner" });

saveButton.addEventListener("click", () => {
  savePlanDraft(store, session.token, {
    title: titleInput.value,
    summary: summaryInput.value,
    source: "browser-demo"
  });
  renderDrafts();
});

render();

function render() {
  sessionStatus.textContent = `${session.role} · ${session.token} · 本地演示会话`;
  renderDecisionGuide();
  renderDrafts();
  renderPermissionMatrix();
  renderGaps();
}

function renderDecisionGuide() {
  decisionList.innerHTML = buildBackendDecisionGuide()
    .map((item) => `
      <li>
        <strong>${escapeHtml(item.scenario)}</strong>
        <span>${item.backendNeeded ? "需要后端" : "本地保存可演示"}</span>
        <p>${escapeHtml(item.reason)}</p>
      </li>
    `)
    .join("");
}

function renderDrafts() {
  const result = listPlanDrafts(store, session.token, { projectId: "project-efficiency-lab" });
  draftList.innerHTML = result.drafts
    .map((draft) => `
      <article class="draft-card">
        <strong>${escapeHtml(draft.title)}</strong>
        <p>${escapeHtml(draft.summary)}</p>
        <small>${escapeHtml(draft.ownerId)} · ${escapeHtml(draft.status)}</small>
      </article>
    `)
    .join("");
}

function renderPermissionMatrix() {
  const rows = buildPermissionMatrix();
  permissionTable.innerHTML = `
    <thead>
      <tr>
        <th>动作</th>
        <th>匿名</th>
        <th>只读</th>
        <th>编辑</th>
        <th>Owner</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${renderFlag(row.anonymous)}</td>
          <td>${renderFlag(row.viewer)}</td>
          <td>${renderFlag(row.editor)}</td>
          <td>${renderFlag(row.owner)}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
}

function renderGaps() {
  gapList.innerHTML = buildProductionGapReport().gaps
    .map((gap) => `<li><strong>${escapeHtml(gap.title)}</strong><br />${escapeHtml(gap.current)} -> ${escapeHtml(gap.required[0])}</li>`)
    .join("");
}

function renderFlag(value) {
  const label = value === "allow" ? "允许" : "拒绝";
  return `<span class="flag ${value}">${label}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
