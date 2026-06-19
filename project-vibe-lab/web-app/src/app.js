import {
  buildAppBrief,
  buildSavedActionCardRecord,
  filterActionCards,
  generateActionCards,
  normalizePlanInput
} from "./plan-app.js";

const storageKey = "efficiency-assistant.saved-plans.v1";
const brief = buildAppBrief();
let currentCards = generateActionCards();

const form = document.querySelector("[data-plan-form]");
const cardList = document.querySelector("[data-action-card-list]");
const savedList = document.querySelector("[data-saved-list]");
const filterForm = document.querySelector("[data-filter-form]");
const summary = document.querySelector("[data-summary]");
const copyResult = document.querySelector("[data-copy-result]");

document.querySelector("[data-page-goal]").textContent = brief.firstPagePromise;
renderActionCards(currentCards);
renderSavedPlans(readSavedPlans());
updateSummary(currentCards);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = normalizePlanInput(Object.fromEntries(new FormData(form).entries()));
  currentCards = generateActionCards(input);
  filterForm.reset();
  renderActionCards(currentCards);
  updateSummary(currentCards);
  copyResult.textContent = "已生成 10 张今日行动卡。";
});

filterForm.addEventListener("change", () => {
  const filters = Object.fromEntries(new FormData(filterForm).entries());
  const visibleCards = filterActionCards(currentCards, filters);
  renderActionCards(visibleCards);
  updateSummary(visibleCards);
});

cardList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const card = currentCards.find((item) => item.id === button.dataset.cardId);
  if (!card) {
    return;
  }

  if (button.dataset.action === "copy") {
    await copyActionCard(card);
    copyResult.textContent = `已复制：${card.title}`;
  }

  if (button.dataset.action === "save") {
    const saved = readSavedPlans();
    const record = buildSavedActionCardRecord(card, { source: "browser-local" });
    const next = [record, ...saved.filter((item) => item.cardId !== record.cardId)].slice(0, 8);
    localStorage.setItem(storageKey, JSON.stringify(next));
    renderSavedPlans(next);
    copyResult.textContent = `已保存到本地计划记录：${card.title}`;
  }
});

document.querySelector("[data-clear-saved]").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  renderSavedPlans([]);
  copyResult.textContent = "本地计划记录已清空。";
});

function renderActionCards(cards) {
  if (cards.length === 0) {
    cardList.innerHTML = '<p class="empty-state">当前筛选条件下没有行动卡。先放宽一个条件。</p>';
    return;
  }

  cardList.innerHTML = cards.map((card) => `
    <article class="action-card">
      <div class="action-meta">
        <span>TOP ${card.rank}</span>
        <span>${escapeHtml(card.type)}</span>
        <span>${escapeHtml(card.difficulty)}</span>
        <span>${escapeHtml(card.stage)}</span>
      </div>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.reason)}</p>
      <div class="tag-row">
        ${card.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="next-action">
        <strong>下一步</strong>
        <p>${escapeHtml(card.nextAction)}</p>
      </div>
      <div class="card-actions">
        <button type="button" data-action="copy" data-card-id="${card.id}">复制</button>
        <button type="button" class="secondary-button" data-action="save" data-card-id="${card.id}">保存</button>
      </div>
    </article>
  `).join("");
}

function renderSavedPlans(records) {
  if (records.length === 0) {
    savedList.innerHTML = '<p class="empty-state">还没有保存计划。先从左侧保存一条。</p>';
    return;
  }

  savedList.innerHTML = records.map((record) => `
    <article class="saved-item">
      <strong>${escapeHtml(record.title)}</strong>
      <span>${escapeHtml(record.difficulty)} / ${escapeHtml(record.type)} / ${escapeHtml(record.stage)}</span>
    </article>
  `).join("");
}

function updateSummary(cards) {
  summary.textContent = `当前显示 ${cards.length} 张行动卡。`;
}

function readSavedPlans() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function copyActionCard(card) {
  const text = [
    card.title,
    `推荐理由：${card.reason}`,
    `下一步：${card.nextAction}`
  ].join("\n");

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
