/* ============================================================================
   SETTINGS - the only part you need to edit
   1. Create a free account at https://cal.com and note your username
      (your booking page is cal.com/<username>).
   2. In Cal.com create one event type per session below; the "slug" is the last
      part of its link, e.g. cal.com/<username>/discovery-call -> "discovery-call".
   3. Put them here, save, and publish.
   ========================================================================== */
const CAL_USERNAME = "clara-tjy";   // cal.com/clara-tjy
const SESSIONS = {
  discovery: "discovery-call",      // 15 min, free
  review: "blind-spot-review",      // 45 min - "Owner's risk assessment" (slug kept)
  followup: "follow-up",            // 30 min
};
const DEFAULT_SESSION = "discovery";

/* ---------------------------------------------------------------- language */
const LANG_KEY = "site-lang";
function setLang(lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
}
function initLang() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  const browserZh = (navigator.language || "").toLowerCase().startsWith("zh");
  setLang(saved || (browserZh ? "zh" : "en"));
  document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
    b.addEventListener("click", () => setLang(document.documentElement.dataset.lang === "zh" ? "en" : "zh"))
  );
}

/* ---------------------------------------------------------------- Cal.com inline embed */
(function (C, A, L) {
  const p = function (a, ar) { a.q.push(ar); };
  const d = C.document;
  C.Cal = C.Cal || function () {
    const cal = C.Cal; const ar = arguments;
    if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || [];
      if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
      else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

let calStarted = false;
function showSession(key) {
  document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.session === key)));
  const box = document.getElementById("cal-box");
  if (!CAL_USERNAME) return;              // placeholder text stays until the username is set
  box.innerHTML = "";
  const slot = document.createElement("div");
  slot.id = "cal-" + key + "-" + Date.now();
  slot.style.width = "100%";
  box.appendChild(slot);
  if (!calStarted) { Cal("init", { origin: "https://cal.com" }); calStarted = true; }
  Cal("inline", {
    elementOrSelector: "#" + slot.id,
    calLink: CAL_USERNAME + "/" + SESSIONS[key],
    layout: "month_view",
    config: { theme: "light" },
  });
}

function initBooking() {
  document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => showSession(t.dataset.session)));
  document.querySelectorAll("[data-book]").forEach((a) =>
    a.addEventListener("click", () => showSession(a.dataset.book))
  );
  showSession(DEFAULT_SESSION);
}

document.addEventListener("DOMContentLoaded", () => {
  initLang();
  initBooking();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
