function isPortfolioViewableOnly(data = {}) {
  const noteProps =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  if (Object.prototype.hasOwnProperty.call(noteProps, "isPortfolioViewableOnly")) {
    return !!noteProps.isPortfolioViewableOnly;
  }
  if (Object.prototype.hasOwnProperty.call(data, "isPortfolioViewableOnly")) {
    return !!data.isPortfolioViewableOnly;
  }
  return false;
}

function isGardenVisible(data) {
  return !isPortfolioViewableOnly(data);
}

module.exports = {
  isPortfolioViewableOnly,
  isGardenVisible,
};
