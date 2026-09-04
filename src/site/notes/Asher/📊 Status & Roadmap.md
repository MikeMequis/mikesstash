---
{"dg-publish":true,"permalink":"/asher/status-and-roadmap/","title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"}}}
---

:::lang en

## Project Status Overview

| Area                         | Status      | Notes                                        |
| ---------------------------- | ----------- | -------------------------------------------- |
| Solution structure           | ✅ Done      | Multi-project architecture stabilized        |
| Launcher-based runtime       | ✅ Done      | Wrapper EXE approach validated               |
| Steam compatibility          | ✅ Done      | Game launches normally via Steam             |
| Runtime initialization       | ✅ Done      | Logs, lifecycle and folders working          |
| Harmony bootstrap            | ✅ Done      | Runtime patching confirmed and working       |
| Mod SDK                      | ✅ Done      | Clean interfaces for mod developers          |
| Default gameplay patches     | ✅ Done      | 5 built-in patches (see Features & Mods)     |
| **Electron manager UI**      | ✅ Done      | Replaces retired WPF `Asher.App`             |
| **Asher.Host JSONL**         | ✅ Done      | Headless service for install/mods/settings   |
| **Patch Manager UI**         | ✅ Done      | Enable/disable mods via folder move          |
| Game-folder logging          | ✅ Done      | `runtime_*`, `manager_*`, `launcher_fatal_*` |
| Zip / Distribution packaging | ✅ Done      | `npm run dist`; GitHub publish via token     |
| Emergency uninstall helper   | ✅ Done      | `Uninstall-Asher.cmd` beside `DustAET.exe`   |
| Safe vs Total removal        | ✅ Done      | In-app uninstall vs emergency script         |
| In-app GitHub updates        | ✅ Done      | Packaged Distribution zip apply              |
| Linux version                | 🔜 Planned  | Runtime patching and UI for Linux port       |
| Content patcher              | 🔜 Planned  | XNA ContentManager interception              |
| Mod metadata (json)          | 🔜 Planned  | mod.json for description, dependencies, etc. |
| Public Mod API docs          | 🔜 Planned  | Developer documentation and examples         |
| Desktop shortcut             | 🔜 Deferred | After-install shortcut creation              

## Recent milestones

### September 2026 — Electron migration complete + packaging
- WPF manager retired; `Asher.Electron` + `Asher.Host` is the only UI (Steps 1–20)
- Settings, home hub, i18n (en/pt/es), Light/Dark theme, toasts, Finish UX
- Zip + `Distribution/` packaging; manager stays out of the game folder
- Emergency `Uninstall-Asher.cmd` / `.ps1`; Safe vs Total uninstallation
- Always-on install backup; GitHub Releases update check/apply
- Manager logs in `{Game}/Asher/AsherLogs/manager_*.log`
- Ported **MuteVoiceActing** and **OverheatDisabler**; **IntroSkipper** rewrite
- Fixed host crash on uninstall→reinstall in one session

### July 2026 — Core runtime & WPF manager
- Launcher, runtime bootstrap, first patches, WPF installer (since retired)

## Current focus

#### 🟨 Patch porting & reverse engineering
Port remaining gameplay patches from **DustAetPatchingPlatform** into the Asher module architecture (`IAsherPreInitModule`, `IAsherPatchModule`, lifecycle hooks).

## Backlog

- **Mod metadata** — `mod.json` schema, load order, dependencies
- **Content Patcher** — intercept `ContentManager.Load<T>()`, `content.json` replacements
- **Mod configuration UI** — per-mod settings files and manager integration

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

## Visão Geral do Status do Projeto

| Área                                  | Status       | Notas                                                 |
| ------------------------------------- | ------------ | ----------------------------------------------------- |
| Estrutura da solução                  | ✅ Feito      | Arquitetura multi-projeto estabilizada                |
| Runtime baseado em launcher           | ✅ Feito      | Abordagem de EXE wrapper validada                     |
| Compatibilidade com Steam             | ✅ Feito      | Jogo inicia normalmente via Steam                     |
| Bootstrap do Harmony                  | ✅ Feito      | Patching em runtime confirmado e funcionando          |
| SDK de mods                           | ✅ Feito      | Interfaces limpas para desenvolvedores de mods        |
| Patches de gameplay padrão            | ✅ Feito      | 5 patches integrados (ver Features & Mods)            |
| **UI Electron do gerenciador**        | ✅ Feito      | Substitui o WPF `Asher.App` descontinuado             |
| **Asher.Host JSONL**                  | ✅ Feito      | Serviço headless para instalar/mods/settings          |
| **UI do Patch Manager**               | ✅ Feito      | Ativar/desativar mods movendo pastas                  |
| Logs na pasta do jogo                 | ✅ Feito      | `runtime_*`, `manager_*`, `launcher_fatal_*`          |
| Empacotamento zip / Distribution      | ✅ Feito      | `npm run dist`; publish GitHub via token              |
| Helper de desinstalação de emergência | ✅ Feito      | `Uninstall-Asher.cmd` ao lado de `DustAET.exe`        |
| Remoção Safe vs Total                 | ✅ Feito      | Uninstall in-app vs script de emergência              |
| Updates via GitHub in-app             | ✅ Feito      | Apply de zip em Distribution empacotado               |
| Linux version                         | 🔜 Planejado | Patching em runtime and interface para porte de Linux |
| Content patcher                       | 🔜 Planejado | Interceptação do XNA ContentManager                   |
| Metadados de mod (json)               | 🔜 Planejado | mod.json para descrição, dependências, etc.           |
| Documentação pública da API de Mods   | 🔜 Planejado | Documentação e exemplos para desenvolvedores          |
| Chrome do assistente de instalação    | 🔜 Adiado    | Welcome / stepper mais completo                       |
| Atalho na área de trabalho            | 🔜 Adiado    | Criação de atalho pós-instalação                      |

## Marcos recentes

### Setembro de 2026 — Migração Electron concluída + empacotamento
- Gerenciador WPF descontinuado; `Asher.Electron` + `Asher.Host` é a única UI (Steps 1–20)
- Settings, home hub, i18n (en/pt/es), tema Light/Dark, toasts, UX de Finish
- Empacotamento zip + `Distribution/`; gerenciador fora da pasta do jogo
- `Uninstall-Asher.cmd` / `.ps1` de emergência; desinstalação Safe vs Total
- Backup sempre ativo na instalação; check/apply de updates via GitHub Releases
- Logs do gerenciador em `{Game}/Asher/AsherLogs/manager_*.log`
- Patches **MuteVoiceActing** e **OverheatDisabler**; **IntroSkipper** reescrito
- Corrigido crash do host ao desinstalar→reinstalar na mesma sessão

### Julho de 2026 — Runtime central e gerenciador WPF
- Launcher, bootstrap do runtime, primeiros patches, instalador WPF (desde então descontinuado)

## Foco atual

#### 🟨 Portabilidade de patches e engenharia reversa
Portar patches de gameplay restantes do **DustAetPatchingPlatform** para a arquitetura de módulos do Asher.

## Backlog

- **Metadados de mod** — esquema `mod.json`, ordem de carregamento, dependências
- **Content Patcher** — interceptar `ContentManager.Load<T>()`, substituições via `content.json`
- **UI de configuração de mods** — arquivos de configuração por mod e integração no gerenciador

---

[[🐱 Asher\|< Voltar]]

:::
