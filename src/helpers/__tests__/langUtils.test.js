import { describe, it, expect } from "vitest";
import {
  resolveLocalizedTitle,
  getLocalizedTitles,
  getLocalizedTitlesFromNoteData,
} from "../langUtils.js";

describe("resolveLocalizedTitle", () => {
  it("returns string titles unchanged", () => {
    expect(resolveLocalizedTitle("Fox", "slug")).toBe("Fox");
  });

  it("falls back when title is missing", () => {
    expect(resolveLocalizedTitle(null, "slug")).toBe("slug");
    expect(resolveLocalizedTitle(undefined, "slug")).toBe("slug");
  });

  it("resolves bilingual maps with Portuguese default", () => {
    const title = { pt: "Raposa", en: "Fox" };
    expect(resolveLocalizedTitle(title, "slug")).toBe("Raposa");
    expect(resolveLocalizedTitle(title, "slug", "pt")).toBe("Raposa");
    expect(resolveLocalizedTitle(title, "slug", "en")).toBe("Fox");
  });

  it("falls back across languages when one is missing", () => {
    expect(resolveLocalizedTitle({ en: "Fox" }, "slug", "pt")).toBe("Fox");
    expect(resolveLocalizedTitle({ pt: "Raposa" }, "slug", "en")).toBe(
      "Raposa"
    );
  });
});

describe("getLocalizedTitles", () => {
  it("duplicates plain string titles", () => {
    expect(getLocalizedTitles("Fox", "slug")).toEqual({
      pt: "Fox",
      en: "Fox",
      default: "Fox",
    });
  });

  it("keeps bilingual maps separate", () => {
    expect(getLocalizedTitles({ pt: "Raposa", en: "Fox" }, "slug")).toEqual({
      pt: "Raposa",
      en: "Fox",
      default: "Raposa",
    });
  });
});

describe("getLocalizedTitlesFromNoteData", () => {
  it("reads nested title objects from Digital Garden publish output", () => {
    expect(
      getLocalizedTitlesFromNoteData(
        { title: { pt: "🏡 Página Inicial", en: "🏡 Home Page" } },
        "slug"
      )
    ).toEqual({
      pt: "🏡 Página Inicial",
      en: "🏡 Home Page",
      default: "🏡 Página Inicial",
    });
  });

  it("reads Obsidian flat title-pt / title-en from dg-note-properties", () => {
    expect(
      getLocalizedTitlesFromNoteData(
        {
          "dg-note-properties": {
            "title-pt": "🎨 Desenhos & Diários",
            "title-en": "🎨 Drawings & Life Logs",
          },
        },
        "slug"
      )
    ).toEqual({
      pt: "🎨 Desenhos & Diários",
      en: "🎨 Drawings & Life Logs",
      default: "🎨 Desenhos & Diários",
    });
  });

  it("prefers nested title over flat keys when both exist", () => {
    expect(
      getLocalizedTitlesFromNoteData(
        {
          title: { pt: "Nested PT", en: "Nested EN" },
          "title-pt": "Flat PT",
          "title-en": "Flat EN",
        },
        "slug"
      )
    ).toEqual({
      pt: "Nested PT",
      en: "Nested EN",
      default: "Nested PT",
    });
  });

  it("falls back to file slug when no title properties exist", () => {
    expect(getLocalizedTitlesFromNoteData({ "dg-publish": true }, "slug")).toEqual({
      pt: "slug",
      en: "slug",
      default: "slug",
    });
  });
});
