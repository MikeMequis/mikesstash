import { Buffer } from "node:buffer";
import { Innertube, ClientType } from "youtubei.js";

const CLIENTS = [ClientType.ANDROID, ClientType.IOS, ClientType.WEB, ClientType.TV_EMBEDDED];

async function getMediaInfo(videoId) {
  let lastError;

  for (const client of CLIENTS) {
    try {
      const yt = await Innertube.create({ retrieve_player: true });
      const info = await yt.getInfo(videoId, { client });
      if (info.playability_status?.status === "OK") {
        return info;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to load video metadata");
}

async function canDownload(info, type) {
  try {
    const format = info.chooseFormat({
      type,
      quality: type === "audio" ? "best" : "360p",
      format: "mp4",
    });
    if (!format) return false;
    const url = format.url || (await format.decipher(info.player));
    return Boolean(url);
  } catch {
    return false;
  }
}

export async function isAudioStreamAvailable(videoId) {
  try {
    const info = await getMediaInfo(videoId);
    if (await canDownload(info, "audio")) return true;
    return canDownload(info, "video+audio");
  } catch {
    return false;
  }
}

async function downloadAudioStream(info) {
  const attempts = [
    { format: "webm", mimeType: "audio/webm" },
    { format: "mp4", mimeType: "audio/mp4" },
    { format: "mp4", mimeType: "video/mp4", type: "video+audio", quality: "360p" },
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const stream = await info.download({
        type: attempt.type || "audio",
        quality: attempt.quality || "best",
        format: attempt.format,
      });
      return { stream, mimeType: attempt.mimeType };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to download audio");
}

async function streamToBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks);
}

export async function fetchAudioBuffer(videoId) {
  const info = await getMediaInfo(videoId);
  const { stream, mimeType } = await downloadAudioStream(info);
  const buffer = await streamToBuffer(stream);
  return { buffer, mimeType };
}

export async function fetchMediaBuffer(videoId) {
  const info = await getMediaInfo(videoId);
  const stream = await info.download({
    type: "video+audio",
    quality: "360p",
    format: "mp4",
  });
  return streamToBuffer(stream);
}
