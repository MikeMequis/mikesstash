import { describe, it, expect } from "vitest";
import {
  resolveLocalizedTitle,
  getLocalizedTitles,
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
