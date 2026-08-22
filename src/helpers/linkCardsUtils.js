const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const matter = require("gray-matter");
const { getLocalizedTitlesFromNoteData } = require("./langUtils");

const NOTES_DIR = path.join(process.cwd(), "src", "site", "notes");
const DESC_MAX_LEN = 160;

const jsYamlForMatter = require(
  require.resolve("js-yaml", { paths: [require.resolve("gray-matter")] })
);
const matterOptions = {
  engines: {
    yaml: {
      parse: (str) => jsYamlForMatter.load(str.replace(/\\\|/g, "|")),
      stringify: (obj) => jsYamlForMatter.dump(obj),
    },
  },
};

let noteCardIndex = null;
let noteCardIndexBuildId = 0;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizePermalink(permalink) {
  if (!permalink || typeof permalink !== "string") return null;
  let p = permalink.trim();
  if (!p) return null;
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p;
}

/**
 * Resolve whether link cards are enabled for a note.
 * Mirrors giscus: note-level dg-note-properties override, then top-level, then env.
 */
function isLinkCardsEnabled(frontMatter = {}, env = process.env) {
  const noteProps =
    frontMatter && typeof frontMatter === "object"
      ? frontMatter["dg-note-properties"] || {}
      : {};

  if (Object.prototype.hasOwnProperty.call(noteProps, "dgShowLinkCards")) {
    return !!noteProps.dgShowLinkCards;
  }
  if (Object.prototype.hasOwnProperty.call(frontMatter, "dgShowLinkCards")) {
    return !!frontMatter.dgShowLinkCards;
  }
  return env.dgShowLinkCards === "true";
}

function readFrontMatterFromFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return matter(raw, matterOptions);
  } catch {
    return null;
  }
}

function stripMarkdownInline(text) {
  return String(text || "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?]]/g, (_, target, alias) =>
      (alias || target).trim()
    )
    .replace(/[*_~`#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text, maxLen = DESC_MAX_LEN) {
  const cleaned = stripMarkdownInline(text);
  if (cleaned.length <= maxLen) return cleaned;
  const sliced = cleaned.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

function extractFirstImage(content) {
  const mdImage = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(content || "");
  if (mdImage && mdImage[1]) return mdImage[1].trim();

  const wikiImage = /!\[\[([^\]|#]+)(?:[|#][^\]]*)?]]/.exec(content || "");
  if (wikiImage && wikiImage[1]) {
    const name = wikiImage[1].trim();
    if (/^https?:\/\//i.test(name) || name.startsWith("/")) return name;
    return `/img/user/${name}`;
  }
  return "";
}

function extractLangBodies(content) {
  const bodies = { pt: "", en: "" };
  const langBlock = /:::lang\s+(pt|en)\s*\r?\n([\s\S]*?):::/gi;
  let match;
  while ((match = langBlock.exec(content || "")) !== null) {
    const lang = match[1].toLowerCase();
    if (!bodies[lang]) bodies[lang] = match[2];
  }
  return bodies;
}

function firstParagraphFromBody(body) {
  if (!body) return "";

  // Prefer supporting text from tip/info callouts when present.
  // Use \r?\n — JS `.` does not match `\r`, so plain `\n` fails on CRLF files.
  const tipMatch =
    />\s*\[!(?:tip|info|note)\][^\r\n]*\r?\n((?:>.*(?:\r?\n|$))+)/i.exec(body) ||
    />\s*\[!(?:tip|info|note)\]\s*(.+?)(?:\r?\n|$)/i.exec(body);
  if (tipMatch) {
    const tipText = tipMatch[1]
      .split(/\r?\n/)
      .map((line) => line.replace(/^>\s?/, "").trim())
      .filter(Boolean)
      .join(" ");
    const truncatedTip = truncateText(tipText);
    if (truncatedTip) return truncatedTip;
  }

  const lines = body.split(/\r?\n/);
  const chunks = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (chunks.length) break;
      continue;
    }
    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (/^!\[/.test(trimmed) || /^!\[\[/.test(trimmed)) continue;
    if (/^>\s*\[!/.test(trimmed) || /^>/.test(trimmed)) continue;
    if (/^```/.test(trimmed) || /^~~~/.test(trimmed)) continue;
    if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) continue;
    if (/^[-*+]\s+\[[ xX]\]/.test(trimmed)) continue;
    chunks.push(trimmed);
  }
  return truncateText(chunks.join(" "));
}

function extractDescriptions(content) {
  const bodies = extractLangBodies(content);
  const pt = firstParagraphFromBody(bodies.pt);
  const en = firstParagraphFromBody(bodies.en);
  if (pt || en) {
    return { pt: pt || en, en: en || pt };
  }
  const fallback = firstParagraphFromBody(content);
  return { pt: fallback, en: fallback };
}

function extractLeadingEmoji(title) {
  const match = String(title || "").match(
    /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F300}-\u{1FAFF}])+/u
  );
  return match ? match[0] : "";
}

function permalinksForNote(data, filePathStem) {
  const props = data["dg-note-properties"] || {};
  const urls = new Set();

  const top = normalizePermalink(data.permalink);
  const nested = normalizePermalink(props.permalink);
  if (top) urls.add(top);
  if (nested) urls.add(nested);

  const tags = []
    .concat(data.tags || [])
    .concat(props.tags || []);
  if (tags.includes("gardenEntry") || data["dg-home"] || props["dg-home"]) {
    urls.add("/");
  }

  if (urls.size === 0 && filePathStem) {
    urls.add(normalizePermalink(`/notes/${filePathStem}`));
  }

  return [...urls];
}

function buildNoteCardIndex(notesDir = NOTES_DIR) {
  const byPermalink = new Map();
  const files = globSync("**/*.{md,markdown}", {
    cwd: notesDir,
    nodir: true,
    windowsPathsNoEscape: true,
  });

  for (const relative of files) {
    const fullPath = path.join(notesDir, relative);
    const parsed = readFrontMatterFromFile(fullPath);
    if (!parsed) continue;

    const stem = relative.replace(/\.(md|markdown)$/i, "").replace(/\\/g, "/");
    const titles = getLocalizedTitlesFromNoteData(parsed.data, path.basename(stem));
    const image = extractFirstImage(parsed.content);
    const descriptions = extractDescriptions(parsed.content);
    const card = {
      titles,
      image,
      descriptions,
      emoji: extractLeadingEmoji(titles.default),
    };

    for (const permalink of permalinksForNote(parsed.data, stem)) {
      byPermalink.set(permalink, card);
    }
  }

  return byPermalink;
}

function getNoteCardIndex() {
  if (!noteCardIndex) {
    noteCardIndex = buildNoteCardIndex();
    noteCardIndexBuildId += 1;
  }
  return noteCardIndex;
}

function clearNoteCardIndex() {
  noteCardIndex = null;
}

function lookupCardMeta(href, index = getNoteCardIndex()) {
  if (!href) return null;
  const clean = normalizePermalink(String(href).split("#")[0].split("?")[0]);
  if (!clean) return null;
  return index.get(clean) || null;
}

function isWhitespaceOrBreak(node) {
  if (!node) return false;
  if (node.nodeType === 3) return !String(node.text || "").trim();
  if (node.nodeType !== 1) return false;
  const tag = String(node.tagName || "").toUpperCase();
  return tag === "BR" || tag === "WBR";
}

/**
 * Returns direct-child internal links when the container is only links +
 * whitespace/`<br>` (common when markdown-it breaks:true joins list-like lines).
 */
function getStandaloneInternalLinks(container) {
  if (!container) return [];
  const anchors = [...container.childNodes].filter((node) => {
    if (node.nodeType !== 1) return false;
    return (
      String(node.tagName || "").toUpperCase() === "A" &&
      node.classList &&
      node.classList.contains("internal-link")
    );
  });
  if (!anchors.length) return [];
  if (anchors.some((a) => a.classList.contains("is-unresolved"))) return [];
  if (anchors.some((a) => a.closest(".dg-link-card"))) return [];

  const onlyLinksAndBreaks = container.childNodes.every((node) => {
    if (anchors.includes(node)) return true;
    return isWhitespaceOrBreak(node);
  });

  return onlyLinksAndBreaks ? anchors : [];
}

function isStandaloneInternalLinkParagraph(paragraph) {
  if (!paragraph || paragraph.tagName !== "P") return false;
  return getStandaloneInternalLinks(paragraph).length === 1;
}

function buildCardHtmlFromMeta(href, meta, noteIcon = "") {
  const titlePt = (meta && meta.titles.pt) || "";
  const titleEn = (meta && meta.titles.en) || titlePt;
  const titleDefault = meta ? meta.titles.default : titlePt || titleEn;
  const image = meta && meta.image ? meta.image : "";
  const emoji = (meta && meta.emoji) || extractLeadingEmoji(titleDefault);
  const descPt = (meta && meta.descriptions.pt) || "";
  const descEn = (meta && meta.descriptions.en) || "";

  let mediaHtml;
  if (image) {
    mediaHtml = `<div class="dg-link-card__media"><img src="${escapeHtml(image)}" alt="" loading="lazy" /></div>`;
  } else if (emoji) {
    mediaHtml = `<div class="dg-link-card__media dg-link-card__media--icon" aria-hidden="true"><span class="dg-link-card__emoji">${escapeHtml(emoji)}</span></div>`;
  } else {
    mediaHtml = `<div class="dg-link-card__media dg-link-card__media--icon" aria-hidden="true"><span class="dg-link-card__emoji">📄</span></div>`;
  }

  let supportHtml = "";
  if (descPt || descEn) {
    supportHtml = `<span class="dg-link-card__support">
      <span class="dg-lang" data-lang="pt">${escapeHtml(descPt || descEn)}</span>
      <span class="dg-lang" data-lang="en">${escapeHtml(descEn || descPt)}</span>
    </span>`;
  }

  const iconAttr = noteIcon
    ? ` data-note-icon="${escapeHtml(noteIcon)}"`
    : "";

  // Title localization attrs stay on the inner title only — langToggle sets
  // textContent on [data-title-pt][data-title-en], which would wipe card markup
  // if those attrs were on the outer <a>.
  return `<a class="dg-link-card internal-link" href="${escapeHtml(href)}"${iconAttr}>
  ${mediaHtml}
  <span class="dg-link-card__body">
    <span class="dg-link-card__title" data-title-pt="${escapeHtml(titlePt)}" data-title-en="${escapeHtml(titleEn)}">${escapeHtml(titleDefault)}</span>
    ${supportHtml}
  </span>
</a>`;
}

function buildCardHtml(anchor, meta) {
  const href = anchor.getAttribute("href") || "#";
  const titlePt =
    anchor.getAttribute("data-title-pt") ||
    (meta && meta.titles.pt) ||
    anchor.text ||
    "";
  const titleEn =
    anchor.getAttribute("data-title-en") ||
    (meta && meta.titles.en) ||
    titlePt;
  const titleDefault = meta ? meta.titles.default : titlePt || titleEn;
  const noteIcon = anchor.getAttribute("data-note-icon") || "";

  // Build synthetic meta preserving anchor-resolved titles
  const syntheticMeta = {
    titles: { pt: titlePt, en: titleEn, default: titleDefault },
    image: meta && meta.image ? meta.image : "",
    emoji: (meta && meta.emoji) || "",
    descriptions: meta ? meta.descriptions : { pt: "", en: "" },
  };

  return buildCardHtmlFromMeta(href, syntheticMeta, noteIcon);
}

function parseSnippet(html) {
  const { parse } = require("node-html-parser");
  return parse(html);
}

/**
 * Convert standalone internal-link paragraphs inside .content into Material-like cards.
 * Supports one-link-per-paragraph and multi-link paragraphs separated by <br>.
 */
function upgradeLinkCards(root, options = {}) {
  const content = root.querySelector(".content");
  if (!content) return;

  const index = options.index || getNoteCardIndex();
  const paragraphs = [...content.querySelectorAll("p")];
  if (!paragraphs.length) return;

  // Each group is { anchors, paragraph, extraParagraphs[] }
  const groups = [];
  let current = null;

  const flush = () => {
    if (current) {
      groups.push(current);
      current = null;
    }
  };

  for (const paragraph of paragraphs) {
    const links = getStandaloneInternalLinks(paragraph);
    if (!links.length) {
      flush();
      continue;
    }

    if (links.length > 1) {
      flush();
      groups.push({
        anchors: links,
        paragraph,
        extraParagraphs: [],
      });
      continue;
    }

    if (!current) {
      current = {
        anchors: [links[0]],
        paragraph,
        extraParagraphs: [],
      };
      continue;
    }

    const lastBlock =
      current.extraParagraphs[current.extraParagraphs.length - 1] ||
      current.paragraph;
    const isConsecutive = paragraph.previousElementSibling === lastBlock;

    if (isConsecutive) {
      current.anchors.push(links[0]);
      current.extraParagraphs.push(paragraph);
    } else {
      flush();
      current = {
        anchors: [links[0]],
        paragraph,
        extraParagraphs: [],
      };
    }
  }
  flush();

  for (const group of groups) {
    const cardsHtml = group.anchors
      .map((anchor) => {
        const meta = lookupCardMeta(anchor.getAttribute("href"), index);
        return buildCardHtml(anchor, meta);
      })
      .join("\n");

    const wrapper = parseSnippet(
      `<div class="dg-link-cards">${cardsHtml}</div>`
    ).firstChild;

    group.paragraph.replaceWith(wrapper);
    for (const extra of group.extraParagraphs) {
      extra.remove();
    }
  }
}

function renderPortfolioCards(notes) {
  const index = getNoteCardIndex();
  const cards = [];

  for (const note of notes) {
    const href = note.url;
    const meta = lookupCardMeta(note.url, index);
    const noteIcon = note.data.noteIcon || process.env.NOTE_ICON_DEFAULT || "";

    if (meta) {
      cards.push(buildCardHtmlFromMeta(href, meta, noteIcon));
    } else {
      const titles = getLocalizedTitlesFromNoteData(note.data, note.fileSlug);
      const fallbackMeta = {
        titles,
        image: "",
        emoji: extractLeadingEmoji(titles.default),
        descriptions: { pt: "", en: "" },
      };
      cards.push(buildCardHtmlFromMeta(href, fallbackMeta, noteIcon));
    }
  }

  if (cards.length === 0) return "";

  return `<div class="dg-link-cards">${cards.join("\n")}</div>`;
}

module.exports = {
  isLinkCardsEnabled,
  buildNoteCardIndex,
  getNoteCardIndex,
  clearNoteCardIndex,
  lookupCardMeta,
  upgradeLinkCards,
  extractDescriptions,
  extractFirstImage,
  extractLeadingEmoji,
  truncateText,
  normalizePermalink,
  buildCardHtml,
  buildCardHtmlFromMeta,
  renderPortfolioCards,
  isStandaloneInternalLinkParagraph,
  noteCardIndexBuildId: () => noteCardIndexBuildId,
};
