/**
 * markdown-it plugin for bilingual content blocks:
 *
 * :::lang pt
 * Texto em português.
 * :::
 *
 * :::lang en
 * English text.
 * :::
 *
 * Renders as:
 * <div class="dg-lang" data-lang="pt">...</div>
 */

const { SUPPORTED_LANGS } = require("./langUtils");

const MARKER_CHAR = ":";
const MARKER_LEN = 3;

function langPlugin(md) {
  function container(state, startLine, endLine, silent) {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];

    if (pos + MARKER_LEN > max) return false;

    const marker = state.src.charCodeAt(pos);
    if (marker !== MARKER_CHAR.charCodeAt(0)) return false;

    let markerCount = 1;
    while (
      pos + markerCount < max &&
      state.src.charCodeAt(pos + markerCount) === marker
    ) {
      markerCount++;
    }
    if (markerCount < MARKER_LEN) return false;

    const markup = state.src.slice(pos, pos + markerCount);
    pos += markerCount;

    const params = state.src.slice(pos, max).trim();
    const match = /^lang\s+([a-z]{2})\s*$/i.exec(params);
    if (!match) return false;

    const lang = match[1].toLowerCase();
    if (!SUPPORTED_LANGS.includes(lang)) return false;

    if (silent) return true;

    let nextLine = startLine;
    let autoClosed = false;

    for (;;) {
      nextLine++;
      if (nextLine >= endLine) break;

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max && state.sCount[nextLine] < state.blkIndent) break;

      if (state.src.charCodeAt(pos) !== marker) continue;
      if (state.sCount[nextLine] - state.blkIndent >= 4) continue;

      let closeCount = 1;
      while (
        pos + closeCount < max &&
        state.src.charCodeAt(pos + closeCount) === marker
      ) {
        closeCount++;
      }
      if (closeCount < markerCount) continue;

      pos += closeCount;
      pos = state.skipSpaces(pos);
      if (pos < max) continue;

      autoClosed = true;
      break;
    }

    const oldParent = state.parentType;
    const oldLineMax = state.lineMax;
    state.parentType = "lang_container";
    state.lineMax = nextLine;

    const tokenOpen = state.push("lang_container_open", "div", 1);
    tokenOpen.markup = markup;
    tokenOpen.block = true;
    tokenOpen.info = lang;
    tokenOpen.map = [startLine, nextLine];

    state.md.block.tokenize(state, startLine + 1, nextLine);

    const tokenClose = state.push("lang_container_close", "div", -1);
    tokenClose.markup = markup;
    tokenClose.block = true;

    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = nextLine + (autoClosed ? 1 : 0);

    return true;
  }

  md.block.ruler.before("fence", "lang_container", container, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.lang_container_open = (tokens, idx) => {
    const lang = tokens[idx].info;
    return `<div class="dg-lang" data-lang="${md.utils.escapeHtml(lang)}">\n`;
  };

  md.renderer.rules.lang_container_close = () => `</div>\n`;
}

module.exports = { langPlugin };
