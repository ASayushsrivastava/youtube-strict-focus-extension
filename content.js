const SELECTORS = {
  containers: "ytd-video-renderer,ytd-rich-item-renderer",
  home: "ytd-rich-grid-renderer",
  related: "#related",
  shorts: "ytd-reel-shelf-renderer",
};

const LOW_VALUE = ["prank", "reaction", "short", "funny", "meme", "challenge"];

let settings = { focus: false, learn: false };
let quoteBar = null;
let quoteIndex = 0;

function hide(el) {
  if (el && !el.dataset.zen) {
    el.style.display = "none";
    el.dataset.zen = "1";
  }
}

function getTitle(el) {
  const nodes = [
    el.querySelector("a#video-title"),
    el.querySelector("#video-title"),
    el.querySelector("h3"),
    el.querySelector("yt-formatted-string"),
  ];
  for (const n of nodes) {
    if (n?.innerText) return n.innerText.toLowerCase();
  }
  return "";
}

function applyZen(root) {
  root.querySelectorAll(SELECTORS.home).forEach(hide);
  root.querySelectorAll(SELECTORS.related).forEach(hide);
  root.querySelectorAll(SELECTORS.shorts).forEach(hide);
}

function applyLearn(root) {
  root.querySelectorAll(SELECTORS.containers).forEach((el) => {
    const t = getTitle(el);
    if (LOW_VALUE.some((k) => t.includes(k))) hide(el);
  });
}

function applyFilters(root = document) {
  if (settings.focus) applyZen(root);
  if (settings.learn) applyLearn(root);
}

function reset() {
  document.querySelectorAll("[data-zen]").forEach((el) => {
    el.style.display = "";
    delete el.dataset.zen;
  });
}

function updateQuoteBar() {
  chrome.storage.sync.get("quotes", (res) => {
    const list = res.quotes || ["Breathe."];
    if (!quoteBar) {
      quoteBar = document.createElement("div");
      quoteBar.style.cssText = `
        position:sticky;top:0;z-index:9999;
        background:#0f172a;color:white;
        padding:10px;text-align:center;font-size:14px;
      `;
      document.body.prepend(quoteBar);
    }
    quoteBar.innerText = list[quoteIndex % list.length];
    quoteIndex++;
  });
}

function loadSettings() {
  chrome.storage.sync.get(["focus", "learn"], (res) => {
    settings = res;
    reset();
    applyFilters(document);
    if (settings.focus || settings.learn) updateQuoteBar();
  });
}

const observer = new MutationObserver((m) =>
  m.forEach((x) => x.addedNodes.forEach(applyFilters))
);
observer.observe(document.body, { childList: true, subtree: true });

chrome.storage.onChanged.addListener(loadSettings);

setInterval(updateQuoteBar, 15000);

loadSettings();
