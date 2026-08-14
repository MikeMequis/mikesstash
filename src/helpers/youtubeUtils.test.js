import { describe, expect, it } from "vitest";
import { parse } from "node-html-parser";
import {
  buildVisualizerHtml,
  extractYouTubeId,
  upgradeYouTubeEmbeds,
} from "./youtubeUtils.js";

describe("extractYouTubeId", () => {
  it("parses youtu.be links", () => {
    expect(
      extractYouTubeId("https://youtu.be/2zNKTBDXBLw?si=otFW8YyhfxrVrn_B")
    ).toBe("2zNKTBDXBLw");
  });

  it("parses watch links", () => {
    expect(
      extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share")
    ).toBe("dQw4w9WgXcQ");
  });

  it("does not treat playlist embeds as videos", () => {
    expect(
      extractYouTubeId(
        "https://www.youtube.com/embed/videoseries?list=PLEo4kE9vpvsM"
      )
    ).toBeNull();
    expect(
      extractYouTubeId(
        "https://music.youtube.com/playlist?list=PLEo4kE9vpvsM"
      )
    ).toBeNull();
  });
});

describe("upgradeYouTubeEmbeds", () => {
  it("replaces youtube links inside content", () => {
    const html = parse(`<main class="content"><p><a href="https://youtu.be/abc123">watch</a></p></main>`);
    upgradeYouTubeEmbeds(html);
    expect(html.querySelector(".yt-visualizer-player")).not.toBeNull();
    expect(html.querySelector(".yt-visualizer-player").getAttribute("data-yt-id")).toBe(
      "abc123"
    );
    expect(html.querySelector("a[href*='youtu']")).toBeNull();
  });

  it("upgrades existing youtube embed markup", () => {
    const html = parse(
      `<main class="content"><div class="youtube-embed"><iframe src="https://www.youtube.com/embed/xyz789"></iframe></div></main>`
    );
    upgradeYouTubeEmbeds(html);
    expect(html.querySelector(".youtube-embed")).toBeNull();
    expect(html.querySelector(".yt-visualizer-player").getAttribute("data-yt-id")).toBe(
      "xyz789"
    );
  });
});

describe("buildVisualizerHtml", () => {
  it("includes the video id and visualizer canvas", () => {
    const html = buildVisualizerHtml("test-id");
    expect(html).toContain('data-yt-id="test-id"');
    expect(html).toContain("yt-visualizer-canvas");
    expect(html).toContain("yt-visualizer-media");
  });
});
