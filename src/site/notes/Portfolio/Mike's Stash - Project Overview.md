---
{"dg-publish":true,"permalink":"/portfolio/mike-s-stash-project-overview/","title":{"pt":"🌐 Mike's Stash - Visão geral de projeto","en":"🌐 Mike's Stash - Project overview"},"dg-note-properties":{"dgShowComments":false,"isPortfolioViewableOnly":true,"title":{"pt":"🌐 Mike's Stash - Visão geral de projeto","en":"🌐 Mike's Stash - Project overview"}}}
---

:::lang pt
# 🌐 Site Mike's Stash - Visão geral de projeto

## Visão geral

O **Mike's Stash** é um website pessoal desenvolvido como uma extensão do meu **Digital Garden**, com foco em organização, apresentação e publicação de conteúdo.

O projeto evoluiu de uma implementação baseada no template [Digital Garden](https://github.com/oleeskild/digitalgarden) para uma aplicação web personalizada, na qual a estrutura de publicação, a navegação e a apresentação visual foram adaptadas às necessidades do conteúdo.

Além de funcionar como espaço de publicação, o projeto também serviu como um laboratório para experimentar **geração estática de páginas, modelagem de conteúdo, interfaces dinâmicas e personalização de uma base de código existente**.

## 💼 Desenvolvimento do Portfólio

Uma das principais extensões do projeto foi a criação de um **Modo Portfólio** independente da experiência tradicional do Jardim.

A implementação introduziu uma segunda camada de apresentação capaz de transformar notas originalmente organizadas como documentos em **projetos estruturados para apresentação profissional**.

O Portfólio possui:

- Navegação e seleção de projetos através de cards;
    
- Agrupamento de conteúdo por projeto;
    
- Estrutura de páginas específica para apresentação;
    
- Organização própria do _file tree_;
    
- Separação entre conteúdo destinado ao Jardim e conteúdo destinado ao Portfólio;
    
- Controle de visibilidade através da propriedade `displayMode`.
    

O `displayMode` permite classificar cada conteúdo como:

- `portfolio` — exibido exclusivamente no Portfólio;
    
- `garden` — exibido exclusivamente no Jardim;
    
- `both` — compartilhado entre as duas experiências.
    

Essa arquitetura permite que **conteúdo e apresentação sejam tratados como camadas independentes**, evitando que a estrutura física dos arquivos determine obrigatoriamente sua representação na interface.

## ⚙️ Customização da arquitetura

O projeto exigiu modificações na estrutura de geração do Digital Garden para suportar diferentes representações do mesmo conjunto de arquivos.

Entre as principais alterações estão:

- Extensão da geração do _file tree_ para aceitar diferentes estratégias de agrupamento;
    
- Agrupamento específico de projetos no contexto do Portfólio;
    
- Processamento de metadados para determinar a disponibilidade de cada conteúdo;
    
- Adaptação da geração de páginas para diferentes contextos de navegação;
    
- Criação de componentes e estilos específicos para a experiência de Portfólio.
    

A solução preserva a estrutura baseada em Markdown utilizada pelo Jardim, enquanto adiciona uma camada de apresentação mais estruturada sobre o mesmo conteúdo.

## 🎨 Sistema visual

O projeto também possui um sistema de temas desenvolvido para permitir diferentes identidades visuais sem alterar a estrutura do conteúdo.

Além dos modos **Claro** e **Escuro**, foram desenvolvidos os temas:

### Nyxa

Identidade visual experimental baseada em uma estética mais expressiva, utilizando diferentes famílias tipográficas para títulos, elementos de destaque e componentes da interface.

Fontes utilizadas:

- **Daft Font**
    
- **Knewave**
    
- **Rubik Dirt**
    

### Lunara

Identidade visual alternativa desenvolvida como contraponto ao Nyxa, utilizando a mesma infraestrutura de temas para apresentar uma interpretação visual distinta da aplicação.

A implementação foi estruturada para manter a separação entre **tokens visuais, componentes e conteúdo**, permitindo a evolução dos temas sem necessidade de modificar as páginas individualmente.

## 🌐 Internacionalização

O site foi estruturado para suportar **português e inglês dentro da mesma base de conteúdo**.

A utilização dos blocos de idioma do sistema de publicação permite manter versões multilíngues de uma página sem duplicar sua estrutura no repositório.

A implementação foi aplicada principalmente às páginas institucionais e às interfaces de navegação, estabelecendo uma base para a expansão progressiva do conteúdo internacionalizado.

## 🧩 Tecnologias e arquitetura

**Stack principal:**

- **Obsidian** — gerenciamento e autoria do conteúdo;
    
- **Markdown** — formato principal de armazenamento;
    
- **Eleventy (11ty)** — geração estática;
    
- **Nunjucks** — templates e composição de páginas;
    
- **JavaScript** — lógica de interface e processamento;
    
- **CSS** — sistema visual e temas;
    
- **Digital Garden** — base arquitetural inicial;
    
- **GitHub** — versionamento e integração do projeto;
    
- **Vercel** — deploy e hospedagem;
    
- **Giscus** — sistema de comentários.
    

O projeto utiliza uma arquitetura na qual **Markdown e metadados representam o conteúdo**, enquanto Eleventy e os componentes da aplicação determinam como esse conteúdo será transformado e apresentado.

Essa separação foi fundamental para possibilitar a coexistência do Jardim e do Portfólio dentro da mesma aplicação.

## 📌 Principais competências demonstradas

O desenvolvimento do _Mike's Stash_ envolveu principalmente:

- Extensão e adaptação de uma base de código existente;
    
- Desenvolvimento de interfaces para diferentes contextos de navegação;
    
- Geração estática de conteúdo;
    
- Modelagem através de metadados;
    
- Manipulação e transformação de estruturas hierárquicas;
    
- Desenvolvimento de sistemas de temas;
    
- Internacionalização de conteúdo;
    
- Organização de arquitetura front-end;
    
- Automação de publicação e deploy;
    
- Integração entre ferramentas de autoria e geração web.
    

O projeto demonstra minha capacidade de **partir de uma solução existente, compreender sua arquitetura e estendê-la para atender requisitos que não faziam parte de sua implementação original**.

[[🏡 Home Page\|< Voltar]]

:::

:::lang en
# 🌐 Website Mike's Stash - Project overview

## Overview

**Mike's Stash** is a personal website developed as an extension of my **Digital Garden**, focused on content organization, presentation, and publishing.

The project evolved from an implementation based on the [Digital Garden](https://github.com/oleeskild/digitalgarden) template into a customized web application, where the publishing structure, navigation, and visual presentation were adapted to the project's requirements.

Beyond serving as a publishing platform, the project became a laboratory for experimenting with **static site generation, content modeling, dynamic interfaces, and customization of an existing codebase**.

## 💼 Portfolio Development

One of the project's main extensions was the creation of an independent **Portfolio Mode**, separate from the traditional Garden experience.

This implementation introduced a second presentation layer capable of transforming content originally organized as documents into **structured projects designed for professional presentation**.

The Portfolio provides:

- Project navigation and selection through cards;
    
- Content grouping by project;
    
- Dedicated project presentation pages;
    
- A Portfolio-specific file tree;
    
- Separation between content intended for the Garden and Portfolio;
    
- Visibility control through the `displayMode` property.
    

The `displayMode` property allows each piece of content to be classified as:

- `portfolio` — displayed exclusively in the Portfolio;
    
- `garden` — displayed exclusively in the Garden;
    
- `both` — shared between both experiences.
    

This architecture allows **content and presentation to be treated as independent layers**, preventing the physical file structure from strictly determining how content is represented in the interface.

## ⚙️ Architectural customization

The project required modifications to the Digital Garden's generation pipeline to support different representations of the same file collection.

The main changes include:

- Extending file tree generation to support different grouping strategies;
    
- Project-specific grouping within the Portfolio;
    
- Metadata processing to determine content availability;
    
- Adaptation of page generation for different navigation contexts;
    
- Custom components and styles for the Portfolio experience.
    

The solution preserves the Markdown-based structure used by the Garden while adding a more structured presentation layer on top of the same content.

## 🎨 Visual system

The project also includes a theme system designed to support different visual identities without changing the underlying content structure.

In addition to **Light** and **Dark** modes, two custom themes were developed:

### Nyxa

An experimental visual identity based on a more expressive aesthetic, using different typefaces for headings, emphasis, and interface components.

Fonts used:

- **Daft Font**
    
- **Knewave**
    
- **Rubik Dirt**
    

### Lunara

An alternative visual identity developed as a counterpart to Nyxa, using the same theme infrastructure to provide a distinct interpretation of the application.

The implementation keeps **visual tokens, components, and content** separated, allowing the themes to evolve without requiring individual page modifications.

## 🌐 Internationalization

The website was structured to support **Portuguese and English within the same content base**.

The publishing system's language blocks allow multilingual versions of a page to be maintained without duplicating its underlying structure in the repository.

The implementation has primarily been applied to institutional pages and navigation interfaces, establishing a foundation for progressively expanding internationalized content.

## 🧩 Technologies and architecture

**Core stack:**

- **Obsidian** — content management and authoring;
    
- **Markdown** — primary content format;
    
- **Eleventy (11ty)** — static site generation;
    
- **Nunjucks** — templates and page composition;
    
- **JavaScript** — interface logic and processing;
    
- **CSS** — visual system and themes;
    
- **Digital Garden** — initial architectural foundation;
    
- **GitHub** — version control and project integration;
    
- **Vercel** — deployment and hosting;
    
- **Giscus** — commenting system.
    

The project follows an architecture in which **Markdown and metadata represent the content**, while Eleventy and the application's components determine how that content is transformed and presented.

This separation was fundamental to supporting both the Garden and Portfolio experiences within the same application.

## 📌 Key skills demonstrated

The development of _Mike's Stash_ involved:

- Extending and adapting an existing codebase;
    
- Designing interfaces for different navigation contexts;
    
- Static site generation;
    
- Metadata-driven content modeling;
    
- Hierarchical data manipulation and transformation;
    
- Theme system development;
    
- Content internationalization;
    
- Front-end architecture;
    
- Automated publishing and deployment;
    
- Integration between authoring and web-generation tools.
    

The project demonstrates my ability to **start from an existing solution, understand its architecture, and extend it to fulfill requirements that were not part of its original implementation**.

[[🏡 Home Page\|< Back]]

:::