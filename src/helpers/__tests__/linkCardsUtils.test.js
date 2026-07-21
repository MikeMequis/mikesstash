import { describe, it, expect, beforeEach } from "vitest";
import { parse } from "node-html-parser";
import {
  isLinkCardsEnabled,
  extractDescriptions,
  extractFirstImage,
  extractLeadingEmoji,
  truncateText,
  normalizePermalink,
  upgradeLinkCards,
  clearNoteCardIndex,
} from "../linkCardsUtils.js";

describe("isLinkCardsEnabled", () => {
  it("reads note-level dg-note-properties override (true)", () => {
    expect(
      isLinkCardsEnabled(
        { "dg-note-properties": { dgShowLinkCards: true } },
        { dgShowLinkCards: "false" }
      )
    ).toBe(true);
  });

  it("reads note-level dg-note-properties override (false)", () => {
    expect(
      isLinkCardsEnabled(
        { "dg-note-properties": { dgShowLinkCards: false } },
        { dgShowLinkCards: "true" }
      )
    ).toBe(false);
  });

  it("falls back to top-level frontmatter", () => {
    expect(
      isLinkCardsEnabled({ dgShowLinkCards: true }, { dgShowLinkCards: "false" })
    ).toBe(true);
  });

  it("falls back to env when no note override", () => {
    expect(isLinkCardsEnabled({}, { dgShowLinkCards: "true" })).toBe(true);
    expect(isLinkCardsEnabled({}, { dgShowLinkCards: "false" })).toBe(false);
    expect(isLinkCardsEnabled({}, {})).toBe(false);
  });
});

describe("extractors", () => {
  it("extracts bilingual descriptions from lang blocks", () => {
    const content = `:::lang pt

Primeiro parágrafo em português com detalhes.

Mais texto.

:::

:::lang en

First English paragraph with details.

More text.

:::
`;
    expect(extractDescriptions(content)).toEqual({
      pt: "Primeiro parágrafo em português com detalhes.",
      en: "First English paragraph with details.",
    });
  });

  it("skips headings and images when picking a description", () => {
    const content = `:::lang pt

# Título

![cover](/img/cover.png)

Texto útil da nota.

:::
`;
    expect(extractDescriptions(content).pt).toBe("Texto útil da nota.");
  });

  it("prefers tip callout text for tutorial-style notes", () => {
    const content = `:::lang pt

# Título

![cover](/img/cover.png)

> [!tip] Precisa de 2GB de RAM e conexão estável.

## Etapa 1

1. Baixe Termux.

:::
`;
    expect(extractDescriptions(content).pt).toContain("2GB de RAM");
  });

  it("extracts the first markdown image", () => {
    expect(
      extractFirstImage("Hello\n\n![alt](/img/user/img/cover.gif)\n\nMore")
    ).toBe("/img/user/img/cover.gif");
  });

  it("extracts leading emoji from titles", () => {
    expect(extractLeadingEmoji("🧱 Asher")).toBe("🧱");
    expect(extractLeadingEmoji("No emoji")).toBe("");
  });

  it("truncates long supporting text", () => {
    const long = "word ".repeat(80);
    const result = truncateText(long, 40);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(41);
  });

  it("normalizes permalinks", () => {
    expect(normalizePermalink("asher")).toBe("/asher/");
    expect(normalizePermalink("/asher")).toBe("/asher/");
    expect(normalizePermalink("/asher/")).toBe("/asher/");
  });
});

describe("upgradeLinkCards", () => {
  beforeEach(() => {
    clearNoteCardIndex();
  });

  it("converts consecutive standalone internal links into a card grid", () => {
    const root = parse(`<main class="content">
<p><a class="internal-link" href="/asher/" data-title-pt="🧱 Asher" data-title-en="🧱 Asher">🧱 Asher</a></p>
<p><a class="internal-link" href="/drawings-and-life-logs/" data-title-pt="🎨 Desenhos" data-title-en="🎨 Drawings">🎨 Drawings</a></p>
<p>Regular paragraph with an <a class="internal-link" href="/asher/">inline</a> link.</p>
</main>`);

    const index = new Map([
      [
        "/asher/",
        {
          titles: { pt: "🧱 Asher", en: "🧱 Asher", default: "🧱 Asher" },
          image: "",
          descriptions: {
            pt: "Plataforma de modding.",
            en: "Modding platform.",
          },
          emoji: "🧱",
        },
      ],
      [
        "/drawings-and-life-logs/",
        {
          titles: {
            pt: "🎨 Desenhos",
            en: "🎨 Drawings",
            default: "🎨 Desenhos",
          },
          image: "/img/user/img/sowy.jpg",
          descriptions: { pt: "Ilustrações.", en: "Illustrations." },
          emoji: "🎨",
        },
      ],
    ]);

    upgradeLinkCards(root, { index });

    const cards = root.querySelector(".dg-link-cards");
    expect(cards).toBeTruthy();
    expect(cards.querySelectorAll(".dg-link-card").length).toBe(2);
    expect(cards.toString()).toContain('href="/asher/"');
    expect(cards.toString()).toContain("Plataforma de modding.");
    expect(cards.toString()).toContain('src="/img/user/img/sowy.jpg"');
    expect(root.toString()).toContain("Regular paragraph");
    expect(root.querySelectorAll("p a.internal-link").length).toBe(1);
  });

  it("converts br-separated links in a single paragraph into cards", () => {
    const root = parse(`<main class="content">
<p><a class="internal-link" href="/asher/">🧱 Asher</a><br>
<a class="internal-link" href="/drawings-and-life-logs/">🎨 Drawings</a></p>
</main>`);

    upgradeLinkCards(root, {
      index: new Map([
        [
          "/asher/",
          {
            titles: { pt: "🧱 Asher", en: "🧱 Asher", default: "🧱 Asher" },
            image: "",
            descriptions: { pt: "Desc PT", en: "Desc EN" },
            emoji: "🧱",
          },
        ],
        [
          "/drawings-and-life-logs/",
          {
            titles: {
              pt: "🎨 Desenhos",
              en: "🎨 Drawings",
              default: "🎨 Desenhos",
            },
            image: "",
            descriptions: { pt: "", en: "" },
            emoji: "🎨",
          },
        ],
      ]),
    });

    expect(root.querySelectorAll(".dg-link-card").length).toBe(2);
    expect(root.querySelector("p")).toBeNull();
  });

  it("does not put data-title attrs on the outer card anchor", () => {
    const root = parse(`<main class="content">
<p><a class="internal-link" href="/asher/" data-title-pt="🧱 Asher" data-title-en="🧱 Asher">🧱 Asher</a></p>
</main>`);

    upgradeLinkCards(root, {
      index: new Map([
        [
          "/asher/",
          {
            titles: { pt: "🧱 Asher", en: "🧱 Asher", default: "🧱 Asher" },
            image: "",
            descriptions: { pt: "", en: "" },
            emoji: "🧱",
          },
        ],
      ]),
    });

    const card = root.querySelector(".dg-link-card");
    expect(card.getAttribute("data-title-pt")).toBeFalsy();
    expect(card.querySelector(".dg-link-card__title").getAttribute("data-title-pt")).toBe(
      "🧱 Asher"
    );
  });
});
