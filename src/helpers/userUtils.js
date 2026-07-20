const { getLocalizedTitlesFromNoteData } = require("./langUtils");

function userComputed(data) {
  const fallback = data.page && data.page.fileSlug ? data.page.fileSlug : "";
  return {
    titles: getLocalizedTitlesFromNoteData(data, fallback),
  };
}

exports.userComputed = userComputed;
