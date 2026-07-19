const { getLocalizedTitles } = require("./langUtils");

function userComputed(data) {
  const fallback = data.page && data.page.fileSlug ? data.page.fileSlug : "";
  return {
    titles: getLocalizedTitles(data.title, fallback),
  };
}

exports.userComputed = userComputed;
