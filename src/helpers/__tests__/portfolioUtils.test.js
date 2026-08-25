import { describe, it, expect } from "vitest";
import { isPortfolioNote, getNavOrder } from "../portfolioUtils.js";

describe("isPortfolioNote", () => {
  it("matches notes under the Portfolio folder", () => {
    expect(
      isPortfolioNote({ filePathStem: "/notes/Portfolio/Asher" })
    ).toBe(true);
  });

  it("matches the Portfolio folder itself", () => {
    expect(isPortfolioNote({ filePathStem: "/notes/Portfolio" })).toBe(true);
  });

  it("rejects non-Portfolio notes", () => {
    expect(isPortfolioNote({ filePathStem: "/notes/Asher" })).toBe(false);
    expect(isPortfolioNote({ filePathStem: "/notes/About/Whatever" })).toBe(
      false
    );
  });

  it("rejects null/undefined", () => {
    expect(isPortfolioNote(null)).toBe(false);
    expect(isPortfolioNote(undefined)).toBe(false);
  });
});

describe("getNavOrder", () => {
  it("reads a numeric value from dg-note-properties", () => {
    expect(getNavOrder({ "dg-note-properties": { navOrder: 1 } })).toBe(1);
  });

  it("reads a numeric value from top-level frontmatter", () => {
    expect(getNavOrder({ navOrder: 3 })).toBe(3);
  });

  it("prefers dg-note-properties over top-level", () => {
    expect(
      getNavOrder({
        navOrder: 9,
        "dg-note-properties": { navOrder: 2 },
      })
    ).toBe(2);
  });

  it("parses string numbers", () => {
    expect(getNavOrder({ "dg-note-properties": { navOrder: "4" } })).toBe(4);
  });

  it("returns null when missing", () => {
    expect(getNavOrder({})).toBeNull();
    expect(getNavOrder({ "dg-note-properties": {} })).toBeNull();
  });

  it("returns null for invalid values", () => {
    expect(getNavOrder({ "dg-note-properties": { navOrder: "abc" } })).toBeNull();
    expect(getNavOrder({ "dg-note-properties": { navOrder: "" } })).toBeNull();
    expect(getNavOrder({ "dg-note-properties": { navOrder: null } })).toBeNull();
  });
});
