import { describe, it, expect } from "vitest";

// Mirrors decode helpers used by getAnchorAttributes / getAnchorLink in .eleventy.js.
function decodeHtmlEntities(value) {
  let out = String(value);
  for (let i = 0; i < 2; i++) {
    const next = out
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/gi, "'");
    if (next === out) break;
    out = next;
  }
  return out;
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeAndSplit(filePath) {
  let fileName = decodeHtmlEntities(filePath);
  let header = "";
  if (fileName.includes("#")) {
    [fileName, header] = fileName.split("#");
  }
  return { fileName, header };
}

describe("getAnchorAttributes entity decode/split logic", () => {
  it("decodes &amp; in path that also contains a heading anchor", () => {
    const filePath =
      "Software Engineering/11 AI &amp; ML/LLM/RAG/Monitoring#Retrieval Quality Metrics";

    const { fileName, header } = decodeAndSplit(filePath);

    expect(fileName).toBe(
      "Software Engineering/11 AI & ML/LLM/RAG/Monitoring",
    );
    expect(header).toBe("Retrieval Quality Metrics");
  });

  it("decodes &amp; in path with no heading anchor", () => {
    const { fileName, header } = decodeAndSplit(
      "Notes/AI &amp; ML/Overview",
    );
    expect(fileName).toBe("Notes/AI & ML/Overview");
    expect(header).toBe("");
  });

  it("handles heading anchor in path without &amp;", () => {
    const { fileName, header } = decodeAndSplit("Notes/Overview#Introduction");
    expect(fileName).toBe("Notes/Overview");
    expect(header).toBe("Introduction");
  });

  it("returns unchanged path when neither &amp; nor # present", () => {
    const { fileName, header } = decodeAndSplit("Notes/Simple Note");
    expect(fileName).toBe("Notes/Simple Note");
    expect(header).toBe("");
  });

  it("decodes link aliases so & and < are not double-escaped in output", () => {
    const alias = decodeHtmlEntities("Features &amp; Mods");
    const back = decodeHtmlEntities("&lt; Voltar");

    expect(alias).toBe("Features & Mods");
    expect(back).toBe("< Voltar");

    // One escape pass for HTML text/attrs — browser then shows the real symbols.
    expect(escapeHtmlText(alias)).toBe("Features &amp; Mods");
    expect(escapeHtmlText(back)).toBe("&lt; Voltar");
    expect(escapeHtmlAttr(alias)).toBe("Features &amp; Mods");
    expect(escapeHtmlAttr(back)).toBe("&lt; Voltar");
  });

  it("undoes a double-encoded alias from markdown + attr escaping", () => {
    expect(decodeHtmlEntities("Features &amp;amp; Mods")).toBe(
      "Features & Mods",
    );
    expect(decodeHtmlEntities("&amp;lt; Voltar")).toBe("< Voltar");
  });
});
