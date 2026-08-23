function isPortfolioNote(note) {
  if (!note) return false;
  const stem = String(note.filePathStem || "").replace(/\\/g, "/");
  const parts = stem.split("/notes/");
  const rel = parts.length > 1 ? parts[parts.length - 1] : stem;
  return rel === "Portfolio" || rel.startsWith("Portfolio/");
}

/**
 * Resolve an explicit Portfolio navbar ordering value.
 * Reads the `portfolioOrder` property, honoring the same note-level
 * `dg-note-properties` override convention used by the other note settings.
 * Returns a finite number, or null when absent/invalid (-> sort last).
 */
function getPortfolioOrder(data = {}) {
  const noteProps =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  let value;
  if (Object.prototype.hasOwnProperty.call(noteProps, "portfolioOrder")) {
    value = noteProps.portfolioOrder;
  } else if (Object.prototype.hasOwnProperty.call(data, "portfolioOrder")) {
    value = data.portfolioOrder;
  }

  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

module.exports = {
  isPortfolioNote,
  getPortfolioOrder,
};
