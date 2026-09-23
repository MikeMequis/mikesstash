---
{"dg-publish":true,"permalink":"/asher/project-overview/","title":{"pt":"🎯 Visão Geral do Projeto","en":"🎯 Project Overview"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🎯 Visão Geral do Projeto","en":"🎯 Project Overview"}}}
---

:::lang en
**Asher** is a launcher-based modding platform for *Dust: An Elysian Tail*. It applies runtime code patches and is designed to replace content **without editing the game's files** — safely, modularly, and in a way that can always be undone.

Dust was not built to be modded. The usual alternatives are invasive: editing `.xnb` content files, permanently modifying the game executable, or injecting code at the earliest possible moment and hoping it survives. Asher takes a different route, inspired by mature mod loaders such as **SMAPI**: start the game through a small launcher, load mods at a controlled point in the startup sequence, and keep everything reversible.

## What Asher provides today

### Runtime & modding
- Dynamic mod loading from `Asher/Mods/`
- Three-stage mod lifecycle: PreInit → Patch → Lifecycle
- A small SDK for mod authors (`AsherModAttribute`, metadata helpers, logging)
- Logs in `Asher/AsherLogs/` (`runtime_*`, `manager_*`, `launcher_fatal_*`)

### Manager app (Electron)
- Guided installation into any valid Dust game folder
- Install always creates a game backup (`Asher.Backup`)
- Patch Manager — enable or disable mods without deleting files
- Launch the game from the manager
- Localization (en-US, pt-BR, es) and Light/Dark theme
- Safe in-app uninstall, plus an emergency `Uninstall-Asher.cmd` beside `DustAET.exe`
- Windows and Linux support (launcher swap on Windows; `LD_PRELOAD` bootstrap on Linux)
- Windows installer + portable zip, and Linux AppImage/tar.gz

### Included patches
Currently, five patch modules ship by default. Each is an external mod loaded at runtime from `Asher/Mods/`:

- **Debug Menu Enabler** — `Tab` in the pause menu opens the debug menu
- **Intro Skipper** — skips the ESRB rating, splash screens, and intro video
- **Graphics Deprofiler** — bypasses HiDef GPU profile restrictions
- **Mute Voice Acting** — mutes voice acting while keeping other SFX
- **Dust Storm Overheat Disabler** — prevents Dust Storm from overheating

## What makes the approach different

- 🚫 No `.xnb` editing
- 🚫 No permanent binary modification
- ✅ Runtime code patching with **Harmony**
- ✅ Fully reversible — remove Asher and the game behaves as before
- ✅ Modular and extensible
- ✅ Clean separation: manager → Host → platform layer → launcher/bootstrap → runtime → SDK → mods
- ✅ Steam-compatible: XNA / .NET Framework on Windows, Mono / FNA on Linux
- ✅ Detailed logging for debugging

## Design principles

Asher follows an explicit initialization order and a controlled runtime lifecycle over fragile early injection. Patching is delayed until the runtime is ready, mods are ordinary DLLs that can be added or removed at any time, and the game folder is never treated as Asher's own — Asher's files stay under `Asher/`.

Replacing game content without touching `.xnb` files is a core goal, but the content patcher is not implemented yet. Richer mod metadata, per-mod configuration, and a public mod API are likewise still ahead. [[Asher/📊 Status & Roadmap\|📊 Status & Roadmap]] tracks what is actually done, in progress, and planned.

> [!note] AI-assisted development
> Asher is built with heavy AI assistance, primarily through **OpenCode**. AI helps with implementation, investigation, refactoring, testing, debugging, and documentation. Architecture, technical direction, scope, validation, and the final call on what ships stay human-directed. See [[Asher/❓ FAQ\|❓ FAQ]] for a fuller answer.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt
**Asher** é uma plataforma de modding baseada em launcher para *Dust: An Elysian Tail*. Ela aplica patches de código em tempo de execução e foi projetada para substituir conteúdo **sem editar os arquivos do jogo** — de forma segura, modular e sempre reversível.

O Dust não foi feito para receber mods. As alternativas usuais são invasivas: editar arquivos `.xnb`, modificar permanentemente o executável do jogo ou injetar código no momento mais cedo possível e torcer para sobreviver. O Asher segue outro caminho, inspirado em mod loaders maduros como o **SMAPI**: iniciar o jogo por um pequeno launcher, carregar mods em um ponto controlado da inicialização e manter tudo reversível.

## O que o Asher oferece hoje

### Runtime & modding
- Carregamento dinâmico de mods a partir de `Asher/Mods/`
- Ciclo de vida de mod em três estágios: PreInit → Patch → Lifecycle
- Um SDK enxuto para autores de mods (`AsherModAttribute`, metadados, logging)
- Logs em `Asher/AsherLogs/` (`runtime_*`, `manager_*`, `launcher_fatal_*`)

### App gerenciador (Electron)
- Instalação guiada em qualquer pasta válida do jogo
- A instalação sempre cria um backup do jogo (`Asher.Backup`)
- Patch Manager — ativa ou desativa mods sem excluir arquivos
- Inicia o jogo pelo gerenciador
- Localização (en-US, pt-BR, es) e tema Light/Dark
- Desinstalação segura in-app, além do `Uninstall-Asher.cmd` de emergência ao lado do `DustAET.exe`
- Suporte a Windows e Linux (troca de launcher no Windows; bootstrap via `LD_PRELOAD` no Linux)
- Instalador + zip portátil no Windows, e AppImage/tar.gz no Linux

### Patches incluídos
Atualmente, cinco patches são criados por padrão. Cada um é um mod externo carregado em tempo de execução de `Asher/Mods/`:

- **Debug Menu Enabler** — `Tab` no menu de pausa abre o menu de depuração
- **Intro Skipper** — pula a classificação ESRB, telas de abertura e vídeo de intro
- **Graphics Deprofiler** — contorna restrições de perfil de GPU HiDef
- **Mute Voice Acting** — silencia a dublagem mantendo outros SFX
- **Dust Storm Overheat Disabler** — impede o Dust Storm de superaquecer

## O que torna a abordagem diferente

- 🚫 Sem edição de `.xnb`
- 🚫 Sem modificação binária permanente
- ✅ Patching de código em runtime com **Harmony**
- ✅ Totalmente reversível — remova o Asher e o jogo volta ao comportamento original
- ✅ Modular e extensível
- ✅ Separação clara: gerenciador → Host → camada de plataforma → launcher/bootstrap → runtime → SDK → mods
- ✅ Compatível com Steam: XNA / .NET Framework no Windows, Mono / FNA no Linux
- ✅ Logs detalhados para depuração

## Princípios de design

O Asher segue uma ordem de inicialização explícita e um ciclo de vida controlado em runtime, em vez de injeção precoce frágil. O patching é postergado até o runtime estar pronto, os mods são DLLs comuns que podem ser adicionados ou removidos a qualquer momento, e a pasta do jogo nunca é tratada como propriedade do Asher — os arquivos do Asher ficam em `Asher/`.

Substituir conteúdo do jogo sem tocar nos `.xnb` é um objetivo central, mas o content patcher ainda não está implementado. Metadados de mod mais ricos, configuração por mod e uma API pública de mods também estão à frente. A página [[Asher/📊 Status & Roadmap\|📊 Status & Roadmap]] mostra o que está feito, em andamento e planejado.

> [!note] Desenvolvimento assistido por IA
> O Asher é desenvolvido com forte apoio de IA, principalmente via **OpenCode**. A IA ajuda na implementação, investigação, refatoração, testes, depuração e documentação. Arquitetura, direção técnica, escopo, validação e a decisão final sobre o que entra continuam sendo humanas. Veja a [[Asher/❓ FAQ\|❓ FAQ]] para uma resposta mais completa.

---
[[🐱 Asher\|< Voltar]]

:::
