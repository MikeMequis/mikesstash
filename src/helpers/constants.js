// Core note settings. dgEnableSearch, dgLinkPreview, and dgShowFileTree
// moved to the dg-search / dg-link-preview / dg-filetree plugins'
// manifest "noteSettings".
exports.ALL_NOTE_SETTINGS = [
  "dgHomeLink",
  "dgPassFrontmatter",
  "dgShowBacklinks",
  "dgShowLocalGraph",
  "dgShowGraphDepthControl",
  "dgShowInlineTitle",
  "dgShowToc",
  "dgShowTags",
  // User features (giscus comments, link cards) that aren't owned by a plugin.
  "dgShowComments",
  "dgShowLinkCards",
];
