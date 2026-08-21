const DISPLAY_MODES = ["garden", "portfolio", "both"];
const DEFAULT_DISPLAY_MODE = "garden";

function getDisplayMode(data = {}) {
  const noteProps =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  let raw;
  if (Object.prototype.hasOwnProperty.call(noteProps, "displayMode")) {
    raw = noteProps.displayMode;
  } else if (Object.prototype.hasOwnProperty.call(data, "displayMode")) {
    raw = data.displayMode;
  }

  if (DISPLAY_MODES.includes(raw)) {
    return raw;
  }
  return DEFAULT_DISPLAY_MODE;
}

function isPortfolioVisible(data) {
  const mode = getDisplayMode(data);
  return mode === "portfolio" || mode === "both";
}

function isGardenVisible(data) {
  const mode = getDisplayMode(data);
  return mode === "garden" || mode === "both";
}

module.exports = {
  DISPLAY_MODES,
  DEFAULT_DISPLAY_MODE,
  getDisplayMode,
  isPortfolioVisible,
  isGardenVisible,
};
