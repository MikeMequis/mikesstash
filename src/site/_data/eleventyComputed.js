const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { getLocalizedTitlesFromNoteData } = require("../../helpers/langUtils");
const {
  isPortfolioVisible,
  isGardenVisible,
} = require("../../helpers/visibilityUtils");
const {
  canonicalPermalink,
  getPortfolioProjectUrls,
  currentProjectPrefix,
} = require("../../helpers/portfolioUtils");
const { userComputed } = require("../../helpers/userUtils");

function computePortfolioContext(data) {
  const url = (data.page && data.page.url) || "";
  if (url !== "/portfolio/" && !url.startsWith("/portfolio/")) {
    return null;
  }
  const notes = data.collections.note || [];
  const projectUrls = getPortfolioProjectUrls(notes);
  const canonical = url === "/portfolio/" ? "" : url.slice("/portfolio".length);
  const projectPrefix = currentProjectPrefix(canonical, projectUrls);
  return { canonical, projectPrefix, projectUrls };
}

function computePortfolioGroup(data) {
  const notes = data.collections.note || [];
  const projectTitles = {};
  notes.forEach((note) => {
    if (isPortfolioVisible(note.data)) {
      const titles = getLocalizedTitlesFromNoteData(note.data, note.fileSlug);
      projectTitles[note.url] = titles.default;
    }
  });

  return (note, meta) => {
    const url = note.url || canonicalPermalink(note.data);
    for (const projectUrl of Object.keys(projectTitles)) {
      if (url === projectUrl || url.startsWith(projectUrl)) {
        return [projectTitles[projectUrl], meta.name + ".md"];
      }
    }
    return [meta.name + ".md"];
  };
}

module.exports = {
  graph: async (data) => await getGraph(data),
  portfolioContext: (data) => computePortfolioContext(data),
  filetree: (data) => {
    const ctx = computePortfolioContext(data);
    if (!ctx) {
      return getFileTree(data, { filter: isGardenVisible });
    }
    const filter = (noteData) => {
      if (isPortfolioVisible(noteData)) {
        return true;
      }
      if (!ctx.projectPrefix) {
        return false;
      }
      const p = canonicalPermalink(noteData);
      return !!p && p !== ctx.projectPrefix && p.startsWith(ctx.projectPrefix);
    };
    return getFileTree(data, {
      filter,
      basePath: "/portfolio",
      group: ctx.projectPrefix ? computePortfolioGroup(data) : undefined,
    });
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
