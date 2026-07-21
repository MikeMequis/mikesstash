---
{"dg-publish":true,"permalink":"/asher/status-and-roadmap/","title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"}}}
---

:::lang en

## Project Status Overview

| Area                       | Status     | Notes                                        |
| -------------------------- | ---------- | -------------------------------------------- |
| Solution structure         | ✅ Done     | Multi-project architecture stabilized        |
| Launcher-based runtime     | ✅ Done     | Wrapper EXE approach validated               |
| Steam compatibility        | ✅ Done     | Game launches normally via Steam             |
| Runtime initialization     | ✅ Done     | Logs, lifecycle and folders working          |
| Injection strategy         | ✅ Done     | No blind injection, controlled bootstrap     |
| Harmony bootstrap          | ✅ Done     | Runtime patching confirmed and working       |
| PreInit system             | ✅ Done     | Flag configuration before patches            |
| Lifecycle hooks            | ✅ Done     | Optional event system for game lifecycle     |
| Mod SDK                    | ✅ Done     | Clean interfaces for mod developers          |
| First gameplay patch       | ✅ Done     | Debug Menu Enabler working                   |
| External mod loader        | ✅ Done     | Dynamic .dll loading from Asher/Mods/        |
| **Installer / Manager UI** | ✅ Done     | WPF app with install wizard & mod manager    |
| **Patch Manager UI**       | ✅ Done     | Enable/disable mods via folder move          |
| **Localization**           | ✅ Done     | English and Portuguese (Brazil)              |
| **Light / Dark theme**     | ✅ Done     | Full-window Material Design theming          |
| Content patcher            | 🔜 Planned | XNA ContentManager interception              |
| Mod metadata (json)        | 🔜 Planned | mod.json for description, dependencies, etc. |
| Public Mod API docs        | 🔜 Planned | Developer documentation and examples         |

## Learning & Implementation Kanban

### 🟢 DONE — Consolidated Phases

#### 🟢 Task 1 — Core Architecture & Bootstrap
**Status:** ✔ Complete

**Deliverables achieved:**
- Stable multi-project solution architecture
- Wrapper EXE approach validated:
  - `DustAET.exe` → Asher Launcher
  - `DustAET.real.exe` → original game executable
- Explicit runtime initialization order guaranteed

#### 🟢 Task 2 — Launcher-Based Runtime Control
**Status:** ✔ Complete

- Custom launcher fully controls game startup
- Runtime initialization occurs before game execution
- Logging, folders, and context prepared deterministically
- Runtime survives Steam launches transparently

#### 🟢 Task 3 — Module System Architecture
**Status:** ✔ Complete

1. **PreInit System** — configuration before patches
2. **Patch System** — Harmony patch application via `IAsherPatchModule`
3. **Lifecycle System** — optional game event hooks

#### 🟢 Task 4 — First Runtime Patch (Debug Enabler)
**Status:** ✔ Complete

- First working gameplay patch: **Debug Menu Enabler**
- PreInit → Patch → Lifecycle flow validated

#### 🟢 Task 5 — Installer & Manager App
**Status:** ✔ Complete

- `Asher.App` WPF installer with guided setup flow
- Game folder auto-detection (Steam, manual browse)
- Deploys runtime, launcher wrapper, and default mods into `Asher/`
- Mod manager with Home, Patch Manager, Settings, and Content Patcher shell
- Patch enable/disable by moving DLLs between `Mods/` and `Mods/disabled/`
- Launch game from manager
- Settings: language, Light/Dark theme, game path, backups
- Desktop shortcut option after installation
- `AsherPaths` helpers and legacy layout migration
- `PrepareDistribution.ps1` for repeatable builds

### 🟨 DOING — Current Phase

#### 🟨 Task 6 — Patch Porting & Reverse Engineering

**Status:** 🔄 In Progress

Port and modernize other existing gameplay patches from **DustAetPatchingPlatform** into the Asher runtime architecture.

**Current workflow:**
1. Inspect game internals using **dnSpy** when required
2. Reimplement using `IAsherPreInitModule`, `IAsherPatchModule`, and optional lifecycle hooks

### 🟥 BACKLOG — Short Term

#### 🔴 Task 7 — Mod Metadata System
- Design `mod.json` schema
- Parse metadata on mod load
- Load priority and dependency support

#### 🔴 Task 8 — Content Patcher (Core)
- Intercept `ContentManager.Load<T>()`
- Resolve replacements via `content.json`
- Support external assets (textures, fonts, data files)

#### 🔴 Task 9 — Mod Configuration System
- `IAsherConfigModule` interface
- Per-mod configuration files
- UI integration for settings

#### 🔴 Task 10 — Mod Dependency System
- Declare dependencies in `mod.json`
- Automatic load order resolution

---
[[🧱 Asher\|< Back]]

:::

:::lang pt

## Visão Geral do Status do Projeto

| Área                                | Status       | Notas                                                    |
| ----------------------------------- | ------------ | -------------------------------------------------------- |
| Estrutura da solução                | ✅ Feito      | Arquitetura multi-projeto estabilizada                   |
| Runtime baseado em launcher         | ✅ Feito      | Abordagem de EXE wrapper validada                        |
| Compatibilidade com Steam           | ✅ Feito      | Jogo inicia normalmente via Steam                        |
| Inicialização do runtime            | ✅ Feito      | Logs, ciclo de vida e pastas funcionando                 |
| Estratégia de injeção               | ✅ Feito      | Sem injeção às cegas, bootstrap controlado               |
| Bootstrap do Harmony                | ✅ Feito      | Patching em runtime confirmado e funcionando             |
| Sistema PreInit                     | ✅ Feito      | Configuração de flags antes dos patches                  |
| Hooks de ciclo de vida              | ✅ Feito      | Sistema opcional de eventos para o ciclo de vida do jogo |
| SDK de mods                         | ✅ Feito      | Interfaces limpas para desenvolvedores de mods           |
| Primeiro patch de gameplay          | ✅ Feito      | Debug Menu Enabler funcional                             |
| Carregador externo de mods          | ✅ Feito      | Carregamento dinâmico de .dll a partir de Asher/Mods/    |
| **Instalador / UI do Gerenciador**  | ✅ Feito      | App WPF com processo de instalação e gerenciador de mods |
| **UI do Patch Manager**             | ✅ Feito      | Ativar/desativar mods movendo pastas                     |
| **Localização**                     | ✅ Feito      | Inglês e Português (Brasil)                              |
| **Tema Claro / Escuro**             | ✅ Feito      | Tema Material Design de janela inteira                   |
| Content patcher                     | 🔜 Planejado | Interceptação do XNA ContentManager                      |
| Metadados de mod (json)             | 🔜 Planejado | mod.json para descrição, dependências, etc.              |
| Documentação pública da API de Mods | 🔜 Planejado | Documentação e exemplos para desenvolvedores             |

## Kanban de Aprendizado & Implementação

### 🟢 CONCLUÍDO — Fases Consolidadas

#### 🟢 Tarefa 1 — Arquitetura Central & Bootstrap
**Status:** ✔ Completo

**Entregas realizadas:**
- Arquitetura de solução multi-projeto estável
- Abordagem de EXE wrapper validada:
    - `DustAET.exe` → Asher Launcher
    - `DustAET.real.exe` → executável original do jogo
- Ordem explícita de inicialização do runtime garantida

#### 🟢 Tarefa 2 — Controle de Runtime Baseado em Launcher
**Status:** ✔ Completo
- Launcher personalizado controla totalmente a inicialização do jogo
- Inicialização do runtime ocorre antes da execução do jogo
- Logging, pastas e contexto preparados de forma determinística
- Runtime sobrevive de forma transparente a inicializações via Steam

#### 🟢 Tarefa 3 — Arquitetura do Sistema de Módulos
**Status:** ✔ Completo
1. **Sistema PreInit** — configuração antes dos patches
2. **Sistema de Patch** — aplicação de patches via Harmony usando `IAsherPatchModule`
3. **Sistema de Ciclo de Vida** — hooks opcionais de eventos do jogo

#### 🟢 Tarefa 4 — Primeiro Patch de Runtime (Debug Enabler)
**Status:** ✔ Completo
- Primeiro patch de gameplay funcional: **Debug Menu Enabler**
- Fluxo PreInit → Patch → Lifecycle validado

#### 🟢 Tarefa 5 — App Instalador & Gerenciador
**Status:** ✔ Completo
- Instalador WPF `Asher.App` com fluxo de configuração guiado
- Detecção automática da pasta do jogo (Steam, navegação manual)
- Implanta o runtime, o wrapper do launcher e os mods padrão em `Asher/`
- Gerenciador de mods com Home, Patch Manager, Configurações e shell do Content Patcher
- Ativação/desativação de patches movendo DLLs entre `Mods/` e `Mods/disabled/`
- Inicia o jogo a partir do gerenciador
- Configurações: idioma, tema Claro/Escuro, caminho do jogo, backups
- Opção de atalho na área de trabalho após a instalação
- Auxiliares `AsherPaths` e migração de layout legado
- `PrepareDistribution.ps1` para builds repetíveis

### 🟨 EM ANDAMENTO — Fase Atual

#### 🟨 Tarefa 6 — Portabilidade de Patches & Engenharia Reversa
**Status:** 🔄 Em Progresso

Portar e modernizar outros patches de gameplay já existentes do **DustAetPatchingPlatform** para a arquitetura de runtime do Asher.

**Fluxo de trabalho atual:**
1. Inspecionar os internos do jogo usando **dnSpy** quando necessário
2. Reimplementar usando `IAsherPreInitModule`, `IAsherPatchModule` e hooks de ciclo de vida opcionais

### 🟥 BACKLOG — Curto Prazo

#### 🔴 Tarefa 7 — Sistema de Metadados de Mod
- Projetar o esquema do `mod.json`
- Analisar metadados ao carregar o mod
- Suporte a prioridade de carregamento e dependências

#### 🔴 Tarefa 8 — Content Patcher (Núcleo)
- Interceptar `ContentManager.Load<T>()`
- Resolver substituições via `content.json`
- Suportar assets externos (texturas, fontes, arquivos de dados)

#### 🔴 Tarefa 9 — Sistema de Configuração de Mods
- Interface `IAsherConfigModule`
- Arquivos de configuração por mod
- Integração com a UI para configurações

#### 🔴 Tarefa 10 — Sistema de Dependências de Mods
- Declarar dependências no `mod.json`
- Resolução automática da ordem de carregamento

---

[[🧱 Asher\|< Voltar]] 

:::