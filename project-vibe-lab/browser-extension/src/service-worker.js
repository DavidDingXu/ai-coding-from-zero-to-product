chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: "#2563EB" });
  chrome.action.setBadgeText({ text: "采" });
});
