import { describe, it, expect, beforeEach } from "vitest";
import { parse } from "node-html-parser";
import {
  isLinkCardsEnabled,
  extractDescriptions,
  getCardDescriptionsFromNoteData,
  resolveNoteDescriptions,
  getCardImageFromNoteData,
  resolveNoteImage,
  extractFirstImage,
  extractLeadingEmoji,
  truncateText,
  normalizePermalink,
  upgradeLinkCards,
  stripLeadingContentGifs,
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

  it("skips tip callouts and uses first prose instead", () => {
    const content = `:::lang pt

# Título

![cover](/img/cover.png)

> [!tip] Precisa de 2GB de RAM e conexão estável.

Texto útil da nota.

## Etapa 1

1. Baixe Termux.

:::
`;
    expect(extractDescriptions(content).pt).toBe("Texto útil da nota.");
    expect(extractDescriptions(content).pt).not.toContain("2GB de RAM");
  });

  it("reads bilingual cardDescription from dg-note-properties", () => {
    expect(
      getCardDescriptionsFromNoteData({
        "dg-note-properties": {
          cardDescription: {
            pt: "Resumo do card em português.",
            en: "Card summary in English.",
          },
        },
      })
    ).toEqual({
      pt: "Resumo do card em português.",
      en: "Card summary in English.",
    });
  });

  it("reads a plain string cardDescription", () => {
    expect(
      getCardDescriptionsFromNoteData({ cardDescription: "Single summary." })
    ).toEqual({ pt: "Single summary.", en: "Single summary." });
  });

  it("prefers cardDescription over body excerpt", () => {
    const content = `:::lang pt

Parágrafo do corpo que não deve aparecer no card.

:::
`;
    expect(
      resolveNoteDescriptions(
        {
          "dg-note-properties": {
            cardDescription: {
              pt: "Descrição explícita.",
              en: "Explicit description.",
            },
          },
        },
        content
      )
    ).toEqual({
      pt: "Descrição explícita.",
      en: "Explicit description.",
    });
  });

  it("falls back to body excerpt when cardDescription is absent", () => {
    const content = `:::lang pt

Texto do corpo.

:::
`;
    expect(resolveNoteDescriptions({}, content)).toEqual({
      pt: "Texto do corpo.",
      en: "Texto do corpo.",
    });
  });

  it("reads cardImage from dg-note-properties", () => {
    expect(
      getCardImageFromNoteData({
        "dg-note-properties": { cardImage: "/img/user/img/Asher.gif" },
      })
    ).toBe("/img/user/img/Asher.gif");
  });

  it("normalizes vault-relative cardImage names", () => {
    expect(
      getCardImageFromNoteData({ cardImage: "Asher.gif" })
    ).toBe("/img/user/img/Asher.gif");
    expect(
      getCardImageFromNoteData({ cardImage: "img/WebHaven/ferramenta.gif" })
    ).toBe("/img/user/img/WebHaven/ferramenta.gif");
  });

  it("prefers cardImage over body image", () => {
    const content = "![other](/img/user/img/other.png)\n\nHello";
    expect(
      resolveNoteImage(
        { "dg-note-properties": { cardImage: "Asher.gif" } },
        content
      )
    ).toBe("/img/user/img/Asher.gif");
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

describe("stripLeadingContentGifs", () => {
  it("removes a leading cover GIF paragraph from note content", () => {
    const root = parse(`<main class="content">
<p><img src="/img/user/img/Asher.gif" alt=""></p>
<h1>Asher</h1>
<p>Body text.</p>
</main>`);

    stripLeadingContentGifs(root);

    expect(root.querySelector('img[src$=".gif"]')).toBeNull();
    expect(root.querySelector("h1").text).toBe("Asher");
    expect(root.querySelector("p").text).toBe("Body text.");
  });

  it("keeps non-leading GIFs in the body", () => {
    const root = parse(`<main class="content">
<h1>Title</h1>
<p><img src="/img/user/img/later.gif" alt=""></p>
</main>`);

    stripLeadingContentGifs(root);

    expect(root.querySelector('img[src$=".gif"]')).toBeTruthy();
  });

  it("does not remove a leading non-GIF image", () => {
    const root = parse(`<main class="content">
<p><img src="/img/user/img/cover.png" alt=""></p>
<p>Hello</p>
</main>`);

    stripLeadingContentGifs(root);

    expect(root.querySelector('img[src$=".png"]')).toBeTruthy();
  });
});
