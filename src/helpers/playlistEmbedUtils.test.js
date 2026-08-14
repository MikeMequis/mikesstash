import { describe, expect, it } from "vitest";
import { parse } from "node-html-parser";
import {
  buildSpotifyEmbedHtml,
  buildYouTubePlaylistEmbedHtml,
  extractYouTubePlaylistId,
  isSpotifyEmbedSrc,
  upgradePlaylistEmbeds,
  withSpotifyTheme,
} from "./playlistEmbedUtils.js";

describe("extractYouTubePlaylistId", () => {
  it("parses YouTube Music playlist links", () => {
    expect(
      extractYouTubePlaylistId(
        "https://music.youtube.com/playlist?list=PLEo4kE9vpvsM&si=BJovglRv0afkDW0W"
      )
    ).toBe("PLEo4kE9vpvsM");
  });

  it("parses youtube.com playlist links", () => {
    expect(
      extractYouTubePlaylistId(
        "https://www.youtube.com/playlist?list=PL39135B8D190B7C97"
      )
    ).toBe("PL39135B8D190B7C97");
  });

  it("parses videoseries embed URLs", () => {
    expect(
      extractYouTubePlaylistId(
        "https://www.youtube.com/embed/videoseries?list=PLMlztVkoMSoo"
      )
    ).toBe("PLMlztVkoMSoo");
  });

  it("returns null for watch URLs", () => {
    expect(
      extractYouTubePlaylistId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBeNull();
  });
});

describe("withSpotifyTheme", () => {
  it("forces the dark Spotify embed theme", () => {
    const themed = withSpotifyTheme(
      "https://open.spotify.com/embed/playlist/7LMo6BzPNzFmR9b6dTg4pP?utm_source=generator"
    );
    expect(themed).toContain("theme=0");
    expect(isSpotifyEmbedSrc(themed)).toBe(true);
  });
});

describe("upgradePlaylistEmbeds", () => {
  it("embeds standalone YouTube Music playlist links", () => {
    const html = parse(
      `<main class="content"><p><a href="https://music.youtube.com/playlist?list=PLEo4kE9vpvsM&amp;si=abc">https://music.youtube.com/playlist?list=PLEo4kE9vpvsM&amp;si=abc</a></p></main>`
    );
    upgradePlaylistEmbeds(html);
    const embed = html.querySelector(".playlist-embed--youtube");
    expect(embed).not.toBeNull();
    expect(embed.getAttribute("data-yt-playlist")).toBe("PLEo4kE9vpvsM");
    expect(html.querySelector("iframe").getAttribute("src")).toContain(
      "embed/videoseries?list=PLEo4kE9vpvsM"
    );
    expect(html.querySelector("p a[href*='music.youtube.com']")).toBeNull();
    expect(html.querySelector(".playlist-embed__open")).not.toBeNull();
  });

  it("does not embed inline playlist links", () => {
    const html = parse(
      `<main class="content"><p>See this <a href="https://youtube.com/playlist?list=PL39135B8D190B7C97">playlist</a> for extra reading.</p></main>`
    );
    upgradePlaylistEmbeds(html);
    expect(html.querySelector(".playlist-embed")).toBeNull();
    expect(html.querySelector("a[href*='playlist']")).not.toBeNull();
  });

  it("restyles Spotify iframes with a dark garden chrome", () => {
    const html = parse(
      `<main class="content"><iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/7LMo6BzPNzFmR9b6dTg4pP?utm_source=generator" width="100%" height="352"></iframe></main>`
    );
    upgradePlaylistEmbeds(html);
    const embed = html.querySelector(".playlist-embed--spotify");
    expect(embed).not.toBeNull();
    expect(html.querySelector("iframe").getAttribute("src")).toContain("theme=0");
    expect(html.querySelector("iframe").getAttribute("style")).toBeFalsy();
  });
});

describe("build embed html", () => {
  it("includes YouTube Music chrome and playlist id", () => {
    const html = buildYouTubePlaylistEmbedHtml("PLEo4kE9vpvsM");
    expect(html).toContain("playlist-embed--youtube");
    expect(html).toContain("YouTube Music");
    expect(html).toContain("color=white");
  });

  it("includes Spotify chrome", () => {
    const html = buildSpotifyEmbedHtml(
      "https://open.spotify.com/embed/playlist/abc"
    );
    expect(html).toContain("playlist-embed--spotify");
    expect(html).toContain("theme=0");
  });
});
