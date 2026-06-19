import { buildBrief } from "./brief-builder.js";

const form = document.querySelector("#brief-form");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-prompt");

let latestPrompt = "";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  try {
    const result = buildBrief({
      idea: data.get("idea"),
      audience: data.get("audience"),
      coreFeatures: data.get("coreFeatures"),
      style: data.get("style"),
      constraints: data.get("constraints")
    });

    latestPrompt = result.prompt;
    renderResult(result);
  } catch (error) {
    latestPrompt = "";
    output.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
    copyButton.disabled = true;
  }
});

copyButton.addEventListener("click", async () => {
  if (!latestPrompt) return;
  await navigator.clipboard.writeText(latestPrompt);
  copyButton.textContent = "已复制";
  setTimeout(() => {
    copyButton.textContent = "复制提示词";
  }, 1200);
});

function renderResult(result) {
  copyButton.disabled = false;
  output.innerHTML = `
    <section class="result-card">
      <p class="eyebrow">产品简报</p>
      <h2>${escapeHtml(result.title)}</h2>
      <pre>${escapeHtml(result.brief)}</pre>
    </section>
    <section class="result-card">
      <p class="eyebrow">给 AI 编程工具的提示词</p>
      <pre>${escapeHtml(result.prompt)}</pre>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
