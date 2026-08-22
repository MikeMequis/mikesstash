import { describe, it, expect } from "vitest";
import {
  isImageViewerEnabled,
  findViewerRegion,
  parseViewerRegion,
  buildViewerHtml,
  renderStaticHtml,
} from "../imageViewerUtils.js";

describe("isImageViewerEnabled", () => {
  it("reads note-level dg-note-properties override (true)", () => {
    expect(
      isImageViewerEnabled({
        "dg-note-properties": { dgShowImageViewer: true },
      })
    ).toBe(true);
  });

  it("reads note-level dg-note-properties override (false)", () => {
    expect(
      isImageViewerEnabled({
        "dg-note-properties": { dgShowImageViewer: false },
      })
    ).toBe(false);
  });

  it("falls back to top-level frontmatter", () => {
    expect(isImageViewerEnabled({ dgShowImageViewer: true })).toBe(true);
    expect(isImageViewerEnabled({ dgShowImageViewer: false })).toBe(false);
  });

  it("returns false when no flag present", () => {
    expect(isImageViewerEnabled({})).toBe(false);
    expect(isImageViewerEnabled({ "dg-note-properties": {} })).toBe(false);
  });

  it("note-level overrides top-level", () => {
    expect(
      isImageViewerEnabled({
        dgShowImageViewer: false,
        "dg-note-properties": { dgShowImageViewer: true },
      })
    ).toBe(true);
    expect(
      isImageViewerEnabled({
        dgShowImageViewer: true,
        "dg-note-properties": { dgShowImageViewer: false },
      })
    ).toBe(false);
  });
});

describe("findViewerRegion", () => {
  it("finds a valid viewer region", () => {
    const source = `before
:::dg-viewer
![img](/a.jpg)
:::dg-viewer
after`;
    const result = findViewerRegion(source);
    expect(result).not.toBeNull();
    expect(result.regionLines).toEqual(["![img](/a.jpg)"]);
  });

  it("returns null when no region", () => {
    const source = `no viewer here`;
    expect(findViewerRegion(source)).toBeNull();
  });

  it("returns null when no close marker", () => {
    const source = `:::dg-viewer\n![img](/a.jpg)`;
    expect(findViewerRegion(source)).toBeNull();
  });

  it("handles multiple regions (first one)", () => {
    const source = `:::dg-viewer\n![a](/a.jpg)\n:::dg-viewer\nmiddle\n:::dg-viewer\n![b](/b.jpg)\n:::dg-viewer`;
    const result = findViewerRegion(source);
    expect(result.regionLines).toEqual(["![a](/a.jpg)"]);
  });
});

describe("parseViewerRegion", () => {
  it("parses images with captions", () => {
    const lines = [
      "![Alt 1](/img/a.jpg)",
      ":::lang pt",
      "Legenda PT",
      ":::",
      ":::lang en",
      "Caption EN",
      ":::",
      "![Alt 2](/img/b.jpg)",
      ":::lang pt",
      "Segunda legenda",
      ":::",
    ];
    const figures = parseViewerRegion(lines);
    expect(figures).toHaveLength(2);
    expect(figures[0].src).toBe("/img/a.jpg");
    expect(figures[0].alt).toBe("Alt 1");
    expect(figures[0].captions.pt).toBe("Legenda PT");
    expect(figures[0].captions.en).toBe("Caption EN");
    expect(figures[1].src).toBe("/img/b.jpg");
    expect(figures[1].captions.pt).toBe("Segunda legenda");
    expect(figures[1].captions.en).toBe("");
  });

  it("handles images without captions", () => {
    const lines = ["![No caption](/img/x.jpg)"];
    const figures = parseViewerRegion(lines);
    expect(figures).toHaveLength(1);
    expect(figures[0].captions.pt).toBe("");
    expect(figures[0].captions.en).toBe("");
  });

  it("handles empty region", () => {
    expect(parseViewerRegion([])).toEqual([]);
  });

  it("ignores non-image lines", () => {
    const lines = [
      "Some text",
      "![img](/a.jpg)",
      "More text",
    ];
    const figures = parseViewerRegion(lines);
    expect(figures).toHaveLength(1);
    expect(figures[0].src).toBe("/a.jpg");
  });

  it("handles multiline captions", () => {
    const lines = [
      "![img](/a.jpg)",
      ":::lang pt",
      "Line 1",
      "Line 2",
      ":::",
    ];
    const figures = parseViewerRegion(lines);
    expect(figures[0].captions.pt).toBe("Line 1\nLine 2");
  });
});

describe("buildViewerHtml", () => {
  const renderMarkdown = (src) => `<p>${src}</p>`;

  it("builds viewer HTML with slides and captions", () => {
    const figures = [
      { src: "/a.jpg", alt: "A", captions: { pt: "PT A", en: "EN A" } },
      { src: "/b.jpg", alt: "B", captions: { pt: "PT B", en: "" } },
    ];
    const html = buildViewerHtml(figures, renderMarkdown);
    expect(html).toContain('data-dg-viewer');
    expect(html).toContain('data-slide-index="0"');
    expect(html).toContain('data-slide-index="1"');
    expect(html).toContain('data-caption-index="0"');
    expect(html).toContain('data-caption-index="1"');
    expect(html).toContain('src="/a.jpg"');
    expect(html).toContain('alt="A"');
    expect(html).toContain('<div class="dg-lang" data-lang="pt"><p>PT A</p></div>');
    expect(html).toContain('<div class="dg-lang" data-lang="en"><p>EN A</p></div>');
  });

  it("uses alt text as fallback when no captions", () => {
    const figures = [{ src: "/x.jpg", alt: "Fallback", captions: { pt: "", en: "" } }];
    const html = buildViewerHtml(figures, renderMarkdown);
    expect(html).toContain("Fallback");
  });

  it("returns empty string for no figures", () => {
    expect(buildViewerHtml([], renderMarkdown)).toBe("");
  });

  it("disables next button for single image", () => {
    const figures = [{ src: "/a.jpg", alt: "A", captions: { pt: "PT", en: "EN" } }];
    const html = buildViewerHtml(figures, renderMarkdown);
    expect(html).toContain('class="dg-image-viewer__next" type="button" disabled aria-disabled="true"');
  });

  it("sets loading=eager for first image", () => {
    const figures = [
      { src: "/a.jpg", alt: "A", captions: { pt: "", en: "" } },
      { src: "/b.jpg", alt: "B", captions: { pt: "", en: "" } },
    ];
    const html = buildViewerHtml(figures, renderMarkdown);
    expect(html).toContain('loading="eager"');
    expect(html).toContain('loading="lazy"');
  });
});

describe("renderStaticHtml", () => {
  it("renders region as plain markdown", () => {
    const lines = ["![img](/a.jpg)", "Some text"];
    const renderMarkdown = (src) => `RENDERED:${src}`;
    const html = renderStaticHtml(lines, renderMarkdown);
    expect(html).toBe("RENDERED:![img](/a.jpg)\nSome text");
  });
});
