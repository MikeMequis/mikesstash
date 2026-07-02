const { parse } = require("node-html-parser");
const { upgradeYouTubeEmbeds } = require("./youtubeUtils");

const markdownFileTypeRegex = /\.(md|markdown)$/i;
const isMarkdownPage = (inputPath) =>
  inputPath && inputPath.match(markdownFileTypeRegex);

async function ytAudioApiMiddleware(req, res, next) {
  const pathname = (req.url || "").split("?")[0];

  const audioCheckMatch = pathname.match(/^\/api\/yt-audio-check\/([^/]+)/);
  if (audioCheckMatch) {
    try {
      const { isAudioStreamAvailable } = await import("./youtubeAudioApi.mjs");
      const available = await isAudioStreamAvailable(audioCheckMatch[1]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify({ available }));
    } catch (_err) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify({ available: false }));
    }
  }

  const audioMatch = pathname.match(/^\/api\/yt-audio\/([^/]+)/);
  if (audioMatch) {
    try {
      const { fetchAudioBuffer } = await import("./youtubeAudioApi.mjs");
      const { buffer, mimeType } = await fetchAudioBuffer(audioMatch[1]);
      res.statusCode = 200;
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Length", buffer.length);
      return res.end(buffer);
    } catch (_err) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Audio stream unavailable" }));
    }
  }

  const mediaCheckMatch = pathname.match(/^\/api\/yt-media-check\/([^/]+)/);
  if (mediaCheckMatch) {
    try {
      const { isAudioStreamAvailable } = await import("./youtubeAudioApi.mjs");
      const available = await isAudioStreamAvailable(mediaCheckMatch[1]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify({ available }));
    } catch (_err) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.end(JSON.stringify({ available: false }));
    }
  }

  const mediaMatch = pathname.match(/^\/api\/yt-media\/([^/]+)/);
  if (mediaMatch) {
    try {
      const { fetchMediaBuffer } = await import("./youtubeAudioApi.mjs");
      const buffer = await fetchMediaBuffer(mediaMatch[1]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Length", buffer.length);
      return res.end(buffer);
    } catch (_err) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Media stream unavailable" }));
    }
  }

  return next();
}

function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
function userEleventySetup(eleventyConfig) {
  eleventyConfig.addTransform("youtube-visualizer", function (content) {
    if (!isMarkdownPage(this.page.inputPath)) {
      return content;
    }
    const parsed = parse(content);
    upgradeYouTubeEmbeds(parsed);
    return parsed.toString();
  });

  eleventyConfig.setServerOptions({
    middleware: [ytAudioApiMiddleware],
  });
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
