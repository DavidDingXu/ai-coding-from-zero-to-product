import {
  buildFeedbackRecord,
  buildLandingCopy,
  validateWaitlistInput
} from "./landing-page.js";

const copy = buildLandingCopy();

document.querySelector("[data-hero-title]").textContent = copy.hero.title;
document.querySelector("[data-hero-subtitle]").textContent = copy.hero.subtitle;

const valueList = document.querySelector("[data-value-cards]");
valueList.innerHTML = copy.valueCards.map((card) => `
  <article class="value-card">
    <h3>${escapeHtml(card.title)}</h3>
    <p>${escapeHtml(card.body)}</p>
  </article>
`).join("");

const steps = document.querySelector("[data-steps]");
steps.innerHTML = copy.steps.map((step, index) => `
  <li>
    <span>${index + 1}</span>
    <p>${escapeHtml(step)}</p>
  </li>
`).join("");

const proof = document.querySelector("[data-proof]");
proof.innerHTML = copy.proofPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const form = document.querySelector("[data-waitlist-form]");
const resultBox = document.querySelector("[data-form-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(form).entries());
  const validation = validateWaitlistInput(input);

  if (!validation.ok) {
    resultBox.className = "form-result form-result-error";
    resultBox.innerHTML = `
      <strong>先修正这几项</strong>
      <ul>${validation.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
    `;
    return;
  }

  const record = buildFeedbackRecord(input);
  resultBox.className = "form-result form-result-success";
  resultBox.innerHTML = `
    <strong>已在本地生成候补记录</strong>
    <p>${escapeHtml(record.name)}，你的反馈已通过本地校验。当前 demo 不上传远程服务。</p>
    <code>${escapeHtml(record.scenario)} / ${escapeHtml(record.role)}</code>
  `;
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
