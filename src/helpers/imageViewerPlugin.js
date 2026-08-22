const {
  isImageViewerEnabled,
  parseViewerRegion,
  buildViewerHtml,
  renderStaticHtml,
} = require("./imageViewerUtils");

const MARKER = ":::dg-viewer";

function imageViewerPlugin(md) {
  function viewerContainer(state, startLine, endLine, silent) {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(pos, max).trim();

    if (lineText !== MARKER) return false;
    if (silent) return true;

    let closeLine = -1;
    for (let i = startLine + 1; i < endLine; i++) {
      const cpos = state.bMarks[i] + state.tShift[i];
      const cmax = state.eMarks[i];
      const cline = state.src.slice(cpos, cmax).trim();
      if (cline === MARKER) {
        closeLine = i;
        break;
      }
    }

    if (closeLine === -1) return false;

    const regionLines = [];
    for (let i = startLine + 1; i < closeLine; i++) {
      const rpos = state.bMarks[i] + state.tShift[i];
      const rmax = state.eMarks[i];
      regionLines.push(state.src.slice(rpos, rmax));
    }

    const env = state.env || {};
    const enabled = isImageViewerEnabled(env);

    const token = state.push("dg_viewer", "", 0);
    token.block = true;
    token.map = [startLine, closeLine + 1];
    token.meta = { regionLines, enabled };

    state.line = closeLine + 1;
    return true;
  }

  md.block.ruler.before("fence", "dg_viewer", viewerContainer, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.dg_viewer = (tokens, idx) => {
    const token = tokens[idx];
    const { regionLines, enabled } = token.meta;

    const renderMarkdown = (src) => md.render(src);

    if (!enabled) {
      return renderStaticHtml(regionLines, renderMarkdown);
    }

    const figures = parseViewerRegion(regionLines);
    if (figures.length === 0) {
      return renderStaticHtml(regionLines, renderMarkdown);
    }

    return buildViewerHtml(figures, renderMarkdown);
  };
}

module.exports = { imageViewerPlugin };
