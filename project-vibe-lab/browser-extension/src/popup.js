import {
  buildMaterialCard,
  buildReadingNoteFromMaterial,
  normalizePageCapture
} from "./browser-extension.js";

const captureButton = document.querySelector("#captureButton");
const clearButton = document.querySelector("#clearButton");
const titleText = document.querySelector("#titleText");
const urlText = document.querySelector("#urlText");
const summaryText = document.querySelector("#summaryText");
const nextActionText = document.querySelector("#nextActionText");
const savedList = document.querySelector("#savedList");

const demoCapture = {
  title: "AI 编程实战文章",
  url: "https://example.com/article",
  selectedText: "用户选中的网页段落会被整理成读书笔记。",
  description: "本地预览模式下使用的示例数据。"
};

captureButton.addEventListener("click", async () => {
  const capture = await captureCurrentPage();
  const card = buildMaterialCard(capture);
  const note = buildReadingNoteFromMaterial(card);
  await saveCard(card);
  renderCard(card, note);
  await renderSavedList();
});

clearButton.addEventListener("click", async () => {
  await writeCards([]);
  await renderSavedList();
});

renderSavedList();

async function captureCurrentPage() {
  if (!globalThis.chrome?.tabs || !globalThis.chrome?.scripting) {
    return normalizePageCapture(demoCapture);
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    return normalizePageCapture(demoCapture);
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const description = document.querySelector("meta[name='description']")?.getAttribute("content") || "";
      return {
        title: document.title,
        url: location.href,
        selectedText: String(globalThis.getSelection?.() || "").trim(),
        description
      };
    }
  });

  return normalizePageCapture(result?.result || demoCapture);
}

async function saveCard(card) {
  const cards = await readCards();
  const nextCards = [card, ...cards.filter((item) => item.id !== card.id)].slice(0, 5);
  await writeCards(nextCards);
}

async function readCards() {
  if (!globalThis.chrome?.storage?.local) {
    return JSON.parse(localStorage.getItem("readingNoteCards") || "[]");
  }

  const result = await chrome.storage.local.get(["readingNoteCards"]);
  return Array.isArray(result.readingNoteCards) ? result.readingNoteCards : [];
}

async function writeCards(cards) {
  if (!globalThis.chrome?.storage?.local) {
    localStorage.setItem("readingNoteCards", JSON.stringify(cards));
    return;
  }

  await chrome.storage.local.set({ readingNoteCards: cards });
}

function renderCard(card, note) {
  titleText.textContent = card.title;
  urlText.textContent = card.url;
  summaryText.textContent = card.summary;
  nextActionText.textContent = note.suggestedPrompt.split("\n")[0];
}

async function renderSavedList() {
  const cards = await readCards();
  if (!cards.length) {
    savedList.textContent = "暂无记录";
    return;
  }

  savedList.innerHTML = cards.map((card) => `
    <article class="saved-item">
      <strong>${escapeHtml(card.title)}</strong>
      <div>${escapeHtml(card.summary)}</div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
