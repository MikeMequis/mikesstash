import { describe, it, expect } from "vitest";
import { isPortfolioNote, getPortfolioOrder } from "../portfolioUtils.js";

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

describe("getPortfolioOrder", () => {
  it("reads a numeric value from dg-note-properties", () => {
    expect(
      getPortfolioOrder({ "dg-note-properties": { portfolioOrder: 1 } })
    ).toBe(1);
  });

  it("reads a numeric value from top-level frontmatter", () => {
    expect(getPortfolioOrder({ portfolioOrder: 3 })).toBe(3);
  });

  it("prefers dg-note-properties over top-level", () => {
    expect(
      getPortfolioOrder({
        portfolioOrder: 9,
        "dg-note-properties": { portfolioOrder: 2 },
      })
    ).toBe(2);
  });

  it("parses string numbers", () => {
    expect(
      getPortfolioOrder({ "dg-note-properties": { portfolioOrder: "4" } })
    ).toBe(4);
  });

  it("returns null when missing", () => {
    expect(getPortfolioOrder({})).toBeNull();
    expect(getPortfolioOrder({ "dg-note-properties": {} })).toBeNull();
  });

  it("returns null for invalid values", () => {
    expect(
      getPortfolioOrder({ "dg-note-properties": { portfolioOrder: "abc" } })
    ).toBeNull();
    expect(
      getPortfolioOrder({ "dg-note-properties": { portfolioOrder: "" } })
    ).toBeNull();
    expect(
      getPortfolioOrder({ "dg-note-properties": { portfolioOrder: null } })
    ).toBeNull();
  });
});
