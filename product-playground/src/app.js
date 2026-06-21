import { buildLearningPath, buildStarterPrompt } from "./playground.js";

const form = document.querySelector("[data-idea-form]");
const timeline = document.querySelector("[data-timeline]");
const summary = document.querySelector("[data-summary]");
const promptBox = document.querySelector("[data-prompt]");

function render(path) {
  summary.textContent = path.summary;
  timeline.innerHTML = "";

  for (const stage of path.stages) {
    const article = document.createElement("article");
    article.className = "stage-card";
    article.innerHTML = `
      <div class="stage-index">${String(stage.order).padStart(2, "0")}</div>
      <div>
        <h3>${stage.title}</h3>
        <p class="visible-result">${stage.visibleResult}</p>
        <dl>
          <dt>进入目录</dt>
          <dd><code>${stage.modulePath}</code></dd>
          <dt>先做动作</dt>
          <dd>${stage.primaryAction.label}${stage.previewUrl ? `：<code>${stage.previewUrl}</code>` : ""}</dd>
          <dt>验证证据</dt>
          <dd>${stage.verification}</dd>
        </dl>
        <p class="transfer">${stage.transferQuestion}</p>
      </div>
    `;
    timeline.append(article);
  }

  promptBox.value = buildStarterPrompt(path.stages[0].modulePath);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  render(
    buildLearningPath({
      idea: formData.get("idea"),
      audience: formData.get("audience")
    })
  );
});

render(
  buildLearningPath({
    idea: "给独立开发者做一个客户需求整理工具",
    audience: "独立开发者"
  })
);
