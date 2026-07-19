import { describe, it, expect } from "vitest";
import markdownIt from "markdown-it";
import { langPlugin } from "../langPlugin.js";

function render(src) {
  const md = markdownIt({ html: true }).use(langPlugin);
  return md.render(src);
}

describe("langPlugin", () => {
  it("wraps Portuguese and English lang containers", () => {
    const html = render(`:::lang pt

Texto em português.

:::

:::lang en

English text.

:::
`);

    expect(html).toContain('<div class="dg-lang" data-lang="pt">');
    expect(html).toContain('<div class="dg-lang" data-lang="en">');
    expect(html).toContain("<p>Texto em português.</p>");
    expect(html).toContain("<p>English text.</p>");
    expect(html).toMatch(/<\/div>\s*<div class="dg-lang" data-lang="en">/);
  });

  it("ignores unsupported languages", () => {
    const html = render(`:::lang fr

Bonjour

:::
`);
    expect(html).not.toContain('data-lang="fr"');
    expect(html).toContain(":::lang fr");
  });

  it("supports nested markdown inside lang blocks", () => {
    const html = render(`:::lang pt

**negrito** e [link](https://example.com)

:::
`);
    expect(html).toContain("<strong>negrito</strong>");
    expect(html).toContain('href="https://example.com"');
  });
});
