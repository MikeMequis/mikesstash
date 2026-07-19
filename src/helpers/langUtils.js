const SUPPORTED_LANGS = ["pt", "en"];
const DEFAULT_LANG = "pt";

/**
 * Resolve a note title that may be a string or a bilingual map
 * ({ pt: "...", en: "..." }) into a plain string for the given language.
 */
function resolveLocalizedTitle(title, fallback = "", lang = DEFAULT_LANG) {
  const safeFallback =
    fallback == null || fallback === "" ? "" : String(fallback);
  const preferred = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;

  if (title == null || title === "") {
    return safeFallback;
  }

  if (typeof title === "string" || typeof title === "number") {
    return String(title);
  }

  if (typeof title === "object" && !Array.isArray(title)) {
    const fromPreferred = title[preferred];
    if (fromPreferred != null && fromPreferred !== "") {
      return String(fromPreferred);
    }
    for (const code of SUPPORTED_LANGS) {
      if (title[code] != null && title[code] !== "") {
        return String(title[code]);
      }
    }
    return safeFallback;
  }

  return safeFallback;
}

/**
 * Build pt/en title strings for runtime language switching in the UI.
 */
function getLocalizedTitles(title, fallback = "") {
  const safeFallback =
    fallback == null || fallback === "" ? "" : String(fallback);

  if (title != null && typeof title === "object" && !Array.isArray(title)) {
    const pt = resolveLocalizedTitle(title, safeFallback, "pt");
    const en = resolveLocalizedTitle(title, safeFallback, "en");
    return { pt, en, default: pt };
  }

  const single = resolveLocalizedTitle(title, safeFallback, DEFAULT_LANG);
  return { pt: single, en: single, default: single };
}

module.exports = {
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  resolveLocalizedTitle,
  getLocalizedTitles,
};
