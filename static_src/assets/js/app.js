// assets/js/app.js

let currentLang = getLangFromUrl() || getLangFromStorage() || "en";
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
  // Önce header/footer partial'larını yükle
  loadPartials()
    .then(() => {
      // Yıl (footer içinde olabilir, o yüzden partial'dan sonra bakmak iyi)
      const yearEl = document.getElementById("year");
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }

      // Dil dosyasını yükle ve uygula
      loadLanguage(currentLang);

      // Dil switcher butonları header içinde, o yüzden partial yüklendikten sonra bağlanmalı
      setupLangSwitcher();
    })
    .catch((err) => {
      console.error("Error in loadPartials:", err);
      // Yine de sayfa tamamen çökmesin diye fallback
      loadLanguage(currentLang);
      setupLangSwitcher();
    });
});

async function loadPartials() {
  const includeEls = document.querySelectorAll("[data-include]");

  const tasks = Array.from(includeEls).map(async (el) => {
    const name = el.dataset.include; // "header" veya "footer"

    try {
      const res = await fetch(`/partials/${name}.html`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.error(`Error loading partial "${name}":`, err);
    }
  });

  return Promise.all(tasks);
}


function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang");
}

function getLangFromStorage() {
  return window.localStorage.getItem("metis_lang");
}

function setLang(lang) {
  currentLang = lang;
  window.localStorage.setItem("metis_lang", lang);

  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url.toString());

  loadLanguage(lang);
}

function loadLanguage(lang) {
  fetch(`/lang/${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      applyTranslations();
    })
    .catch((err) => {
      console.error("Error loading language:", err);
    });
}

function applyTranslations() {
  // Normal text
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  // Attributes (meta description vs.)
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const spec = el.dataset.i18nAttr; // "content:meta.home.description"
    const [attr, key] = spec.split(":");
    if (translations[key]) {
      el.setAttribute(attr, translations[key]);
    }
  });
}

function setupLangSwitcher() {
  document.querySelectorAll(".lang-switcher button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLang(lang);
    });
  });
}
