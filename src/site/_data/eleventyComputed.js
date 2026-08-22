const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { isGardenVisible } = require("../../helpers/visibilityUtils");
const { isPortfolioNote } = require("../../helpers/portfolioUtils");
const { userComputed } = require("../../helpers/userUtils");

function isPortfolioView(data) {
  const url = (data.page && data.page.url) || "";
  return url === "/portfolio/" || url.startsWith("/portfolio/");
}

module.exports = {
  graph: async (data) => await getGraph(data),
  portfolioContext: (data) => (isPortfolioView(data) ? {} : null),
  filetree: (data) => {
    if (isPortfolioView(data)) {
      return getFileTree(data, {
        filter: (_noteData, note) => isPortfolioNote(note),
        group: (_note, _meta, folders) => {
          const idx = folders.indexOf("Portfolio");
          return idx === 0 ? folders.slice(1) : folders;
        },
      });
    }
    return getFileTree(data, { filter: isGardenVisible });
  },
  viewToggle: (data) => {
    const url = (data.page && data.page.url) || "";
    const onPortfolio = url === "/portfolio/" || url.startsWith("/portfolio/");
    if (onPortfolio) {
      return {
        href: "/",
        emoji: "💼",
        labelPt: "Jardim",
        labelEn: "Garden",
      };
    }
    return {
      href: "/portfolio/",
      emoji: "🌱",
      labelPt: "Portfólio",
      labelEn: "Portfolio",
    };
  },
  userComputed: (data) => userComputed(data),
  noteProps: (data) => data["dg-note-properties"],
};
