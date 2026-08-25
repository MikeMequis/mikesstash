const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const matter = require("gray-matter");
const { getLocalizedTitlesFromNoteData } = require("./langUtils");
const { stripViewerRegions } = require("./imageViewerUtils");
const { getNavOrder } = require("./portfolioUtils");

const NOTES_DIR = path.join(process.cwd(), "src", "site", "notes");
const DESC_MAX_LEN = 200;

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

/**
 * Optional explicit card image from frontmatter (top-level or dg-note-properties).
 * Accepts absolute/URL paths, or vault-relative names like `Asher.gif` / `img/Asher.gif`.
 */
function normalizeCardImage(value) {
  const s = String(value == null ? "" : value).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s;
  if (s.startsWith("img/")) return `/img/user/${s}`;
  return `/img/user/img/${s}`;
}

function getCardImageFromNoteData(data = {}) {
  const props =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  let value;
  if (Object.prototype.hasOwnProperty.call(props, "cardImage")) {
    value = props.cardImage;
  } else if (Object.prototype.hasOwnProperty.call(data, "cardImage")) {
    value = data.cardImage;
  } else {
    return null;
  }

  const normalized = normalizeCardImage(value);
  return normalized || null;
}

function resolveNoteImage(data, content) {
  return getCardImageFromNoteData(data) || extractFirstImage(content) || "";
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

/**
 * Optional explicit card support text from frontmatter.
 * Supports string or { pt, en } on top-level or dg-note-properties.
 * Returns null when absent so callers can fall back to body excerpt.
 */
function getCardDescriptionsFromNoteData(data = {}) {
  const props =
    data && typeof data === "object" ? data["dg-note-properties"] || {} : {};

  let value;
  if (Object.prototype.hasOwnProperty.call(props, "cardDescription")) {
    value = props.cardDescription;
  } else if (Object.prototype.hasOwnProperty.call(data, "cardDescription")) {
    value = data.cardDescription;
  } else {
    return null;
  }

  if (value == null || value === "") return null;

  if (typeof value === "string" || typeof value === "number") {
    const text = truncateText(String(value));
    return text ? { pt: text, en: text } : null;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const pt = truncateText(value.pt || "");
    const en = truncateText(value.en || "");
    if (!pt && !en) return null;
    return { pt: pt || en, en: en || pt };
  }

  return null;
}

function resolveNoteDescriptions(data, content) {
  return getCardDescriptionsFromNoteData(data) || extractDescriptions(content);
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
    const image = resolveNoteImage(parsed.data, parsed.content);
    const descriptions = resolveNoteDescriptions(parsed.data, parsed.content);
    const portfolioContent = stripViewerRegions(parsed.content);
    const imagePortfolio = resolveNoteImage(parsed.data, portfolioContent);
    const descriptionsPortfolio = resolveNoteDescriptions(
      parsed.data,
      portfolioContent
    );
    const card = {
      titles,
      image,
      descriptions,
      imagePortfolio,
      descriptionsPortfolio,
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

  const sortedNotes = (notes || []).slice().sort((a, b) => {
    const aOrder = getNavOrder(a.data);
    const bOrder = getNavOrder(b.data);
    const aNum = aOrder == null ? Infinity : aOrder;
    const bNum = bOrder == null ? Infinity : bOrder;
    return aNum - bNum;
  });

  for (const note of sortedNotes) {
    const href = note.url;
    const meta = lookupCardMeta(note.url, index);
    const noteIcon = note.data.noteIcon || process.env.NOTE_ICON_DEFAULT || "";

    if (meta) {
      const portfolioMeta = Object.assign({}, meta, {
        image: meta.imagePortfolio != null ? meta.imagePortfolio : meta.image,
        descriptions:
          meta.descriptionsPortfolio || meta.descriptions || { pt: "", en: "" },
      });
      cards.push(buildCardHtmlFromMeta(href, portfolioMeta, noteIcon));
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

function isGifSrc(src) {
  return /\.gif(?:$|[?#])/i.test(String(src || ""));
}

/**
 * Remove leading cover GIFs from rendered note HTML so they appear on cards
 * only (card index still reads the raw markdown image).
 */
function stripLeadingContentGifs(root) {
  if (!root) return;
  const content = root.querySelector(".content") || root;
  const nodes = [...content.childNodes];

  for (const node of nodes) {
    if (node.nodeType === 3) {
      if (!String(node.text || "").trim()) continue;
      break;
    }
    if (node.nodeType !== 1) break;

    const tag = String(node.tagName || "").toUpperCase();

    if (tag === "IMG" && isGifSrc(node.getAttribute("src"))) {
      node.remove();
      continue;
    }

    if (tag === "P") {
      const imgs = [...(node.querySelectorAll ? node.querySelectorAll("img") : [])];
      const hasOnlyGifImage =
        imgs.length === 1 &&
        isGifSrc(imgs[0].getAttribute("src")) &&
        !String(node.textContent || "")
          .replace(/\s+/g, "")
          .length;
      if (hasOnlyGifImage) {
        node.remove();
        continue;
      }
    }

    break;
  }
}

module.exports = {
  isLinkCardsEnabled,
  buildNoteCardIndex,
  getNoteCardIndex,
  clearNoteCardIndex,
  lookupCardMeta,
  upgradeLinkCards,
  stripLeadingContentGifs,
  extractDescriptions,
  getCardDescriptionsFromNoteData,
  resolveNoteDescriptions,
  getCardImageFromNoteData,
  resolveNoteImage,
  normalizeCardImage,
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
