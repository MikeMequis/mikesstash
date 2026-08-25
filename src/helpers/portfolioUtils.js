function isPortfolioNote(note) {
  if (!note) return false;
  const stem = String(note.filePathStem || "").replace(/\\/g, "/");
  const parts = stem.split("/notes/");
  const rel = parts.length > 1 ? parts[parts.length - 1] : stem;
  return rel === "Portfolio" || rel.startsWith("Portfolio/");
}

/**
 * Resolve an explicit navbar ordering value for Garden and Portfolio.
 * Reads the `navOrder` property, honoring the same note-level
 * `dg-note-properties` override convention used by the other note settings.
 * Returns a finite number, or null when absent/invalid (-> sort last).
 */
function getNavOrder(data = {}) {
  const noteProps =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  let value;
  if (Object.prototype.hasOwnProperty.call(noteProps, "navOrder")) {
    value = noteProps.navOrder;
  } else if (Object.prototype.hasOwnProperty.call(data, "navOrder")) {
    value = data.navOrder;
  }

  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

module.exports = {
  isPortfolioNote,
  getNavOrder,
};
