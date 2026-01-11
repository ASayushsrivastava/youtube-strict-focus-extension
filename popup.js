const DEFAULT_QUOTES = [
  "Slow down. You don’t need to watch everything.",
  "Use the internet, don’t let it use you.",
  "Quality over noise.",
  "Your attention is precious.",
];

document.addEventListener("DOMContentLoaded", () => {
  ["focus", "learn"].forEach((key) => {
    const box = document.getElementById(key);
    chrome.storage.sync.get(key, (res) => {
      box.checked = res[key] || false;
    });
    box.onchange = () => chrome.storage.sync.set({ [key]: box.checked });
  });

  const textarea = document.getElementById("quotes");

  chrome.storage.sync.get("quotes", (res) => {
    textarea.value = (res.quotes || DEFAULT_QUOTES).join("\n");
  });

  document.getElementById("save").onclick = () => {
    const quotes = textarea.value
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);
    chrome.storage.sync.set({ quotes });
  };
});
