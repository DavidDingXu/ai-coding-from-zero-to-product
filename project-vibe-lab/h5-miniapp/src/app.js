import {
  buildFavoriteRecord,
  buildMobileActionPlan,
  buildPublishChecklist,
  buildShareText,
  normalizeMobileInput
} from "./h5-miniapp.js";

const storageKey = "efficiency-assistant.h5-favorites.v1";

const form = document.querySelector("[data-mobile-form]");
const recommendationList = document.querySelector("[data-recommendation-list]");
const shareBox = document.querySelector("[data-share-text]");
const favoriteList = document.querySelector("[data-favorite-list]");
const feedback = document.querySelector("[data-feedback]");
const h5Checks = document.querySelector("[data-h5-checks]");
const miniappChecks = document.querySelector("[data-miniapp-checks]");

let currentPlan = buildMobileActionPlan();

renderPlan(currentPlan);
renderFavorites(readFavorites());
renderPublishChecks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPlan = buildMobileActionPlan(Object.fromEntries(new FormData(form).entries()));
  renderPlan(currentPlan);
  feedback.textContent = "已按手机端短流程生成 3 条今日推荐。";
});

recommendationList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const recommendation = currentPlan.recommendations.find((item) => item.id === button.dataset.recommendationId);
  if (!recommendation) {
    return;
  }

  if (button.dataset.action === "favorite") {
    const record = buildFavoriteRecord(recommendation, { source: "h5-local" });
    const next = [record, ...readFavorites().filter((item) => item.recommendationId !== record.recommendationId)].slice(0, 5);
    localStorage.setItem(storageKey, JSON.stringify(next));
    renderFavorites(next);
    feedback.textContent = `已收藏：${recommendation.title}`;
  }

  if (button.dataset.action === "share") {
    const text = buildShareText({
      ...currentPlan,
      recommendations: [recommendation, ...currentPlan.recommendations.filter((item) => item.id !== recommendation.id)]
    });
    shareBox.value = text;
    feedback.textContent = "已生成可复制的行动文本。";
  }
});

document.querySelector("[data-clear-favorites]").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  renderFavorites([]);
  feedback.textContent = "本地收藏已清空。";
});

function renderPlan(plan) {
  recommendationList.innerHTML = plan.recommendations.map((recommendation) => `
    <article class="recommendation-card">
      <div class="recommendation-topline">
        <span>TOP ${recommendation.rank}</span>
        <strong>${escapeHtml(recommendation.label)}</strong>
      </div>
      <h3>${escapeHtml(recommendation.title)}</h3>
      <p>${escapeHtml(recommendation.mobileReason)}</p>
      <div class="quick-action">
        <span>下一步</span>
        <p>${escapeHtml(recommendation.quickAction)}</p>
      </div>
      <div class="card-actions">
        <button type="button" data-action="share" data-recommendation-id="${recommendation.id}">生成行动文本</button>
        <button type="button" class="secondary-button" data-action="favorite" data-recommendation-id="${recommendation.id}">收藏</button>
      </div>
    </article>
  `).join("");
  shareBox.value = buildShareText(plan);
}

function renderFavorites(records) {
  if (records.length === 0) {
    favoriteList.innerHTML = '<p class="empty-state">还没有收藏。先收藏一条今日推荐。</p>';
    return;
  }

  favoriteList.innerHTML = records.map((record) => `
    <article class="favorite-item">
      <strong>${escapeHtml(record.title)}</strong>
      <span>${escapeHtml(record.note || "本地收藏")}</span>
    </article>
  `).join("");
}

function renderPublishChecks() {
  const h5 = buildPublishChecklist({ route: "h5" });
  const miniapp = buildPublishChecklist({ route: "miniapp" });
  h5Checks.innerHTML = h5.requiredChecks.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  miniappChecks.innerHTML = miniapp.requiredChecks.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function readFavorites() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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
