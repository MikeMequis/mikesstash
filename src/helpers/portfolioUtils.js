function isPortfolioNote(note) {
  if (!note) return false;
  const stem = String(note.filePathStem || "").replace(/\\/g, "/");
  const parts = stem.split("/notes/");
  const rel = parts.length > 1 ? parts[parts.length - 1] : stem;
  return rel === "Portfolio" || rel.startsWith("Portfolio/");
}

module.exports = {
  isPortfolioNote,
};
