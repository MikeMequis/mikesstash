const YOUTUBE_ID_PATTERNS = [
  /youtu\.be\/([^?&#/]+)/i,
  /youtube\.com\/watch\?(?:[^#]*&)?v=([^?&#/]+)/i,
  /youtube\.com\/embed\/([^?&#/]+)/i,
  /youtube\.com\/shorts\/([^?&#/]+)/i,
  /youtube\.com\/v\/([^?&#/]+)/i,
];

function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function buildVisualizerHtml(videoId) {
  return `<div class="yt-visualizer-player" data-yt-id="${videoId}">
  <div class="yt-visualizer-video">
    <video class="yt-visualizer-media" controls playsinline crossorigin="anonymous" preload="metadata" poster="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg"></video>
    <div class="yt-visualizer-video-target yt-visualizer-fallback" hidden></div>
  </div>
  <div class="yt-visualizer-eq" aria-hidden="true">
    <canvas class="yt-visualizer-canvas"></canvas>
  </div>
</div>`;
}

function parseSnippet(html) {
  const { parse } = require("node-html-parser");
  return parse(html).firstChild;
}

function shouldReplaceParentParagraph(anchor) {
  const parent = anchor.parentNode;
  if (!parent || parent.tagName !== "P") return false;
  return parent.childNodes.every((node) => {
    if (node === anchor) return true;
    return node.nodeType === 3 && !String(node.text || "").trim();
  });
}

function upgradeYouTubeEmbeds(root) {
  const content = root.querySelector(".content");
  if (!content) return;

  for (const embed of content.querySelectorAll(".youtube-embed")) {
    if (embed.closest(".yt-visualizer-player")) continue;
    const iframe = embed.querySelector("iframe");
    if (!iframe) continue;
    const videoId = extractYouTubeId(iframe.getAttribute("src") || "");
    if (!videoId) continue;
    embed.replaceWith(parseSnippet(buildVisualizerHtml(videoId)));
  }

  for (const anchor of content.querySelectorAll("a[href]")) {
    if (anchor.closest(".yt-visualizer-player")) continue;
    const videoId = extractYouTubeId(anchor.getAttribute("href") || "");
    if (!videoId) continue;

    const replacement = parseSnippet(buildVisualizerHtml(videoId));
    if (shouldReplaceParentParagraph(anchor)) {
      anchor.parentNode.replaceWith(replacement);
    } else {
      anchor.replaceWith(replacement);
    }
  }
}

module.exports = {
  extractYouTubeId,
  buildVisualizerHtml,
  upgradeYouTubeEmbeds,
};
