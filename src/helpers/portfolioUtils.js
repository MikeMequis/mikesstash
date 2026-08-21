const { isPortfolioViewable } = require("./linkCardsUtils");

function canonicalPermalink(data) {
  if (data && data.tags && data.tags.indexOf("gardenEntry") !== -1) return "/";
  return (data && data.permalink) || "";
}

function getPortfolioProjectUrls(notes) {
  const urls = new Set();
  (notes || []).forEach((n) => {
    if (isPortfolioViewable(n.data)) {
      const u = n.url || canonicalPermalink(n.data);
      if (u) urls.add(u);
    }
  });
  return Array.from(urls);
}

function isPortfolioReachable(url, projectUrls) {
  if (!url) return false;
  return projectUrls.some((p) => url === p || url.startsWith(p));
}

function currentProjectPrefix(canonicalUrl, projectUrls) {
  return projectUrls.find((p) => canonicalUrl === p || canonicalUrl.startsWith(p)) || "";
}

function toPortfolioLink(canonicalLink, projectPrefix) {
  if (!projectPrefix) return canonicalLink;
  if (canonicalLink === projectPrefix || canonicalLink.startsWith(projectPrefix)) {
    return "/portfolio" + canonicalLink;
  }
  return canonicalLink;
}

module.exports = {
  canonicalPermalink,
  getPortfolioProjectUrls,
  isPortfolioReachable,
  currentProjectPrefix,
  toPortfolioLink,
};
