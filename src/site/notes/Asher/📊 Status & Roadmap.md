---
{"dg-publish":true,"permalink":"/asher/status-and-roadmap/","title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"📊 Progresso & Roadmap","en":"📊 Status & Roadmap"}}}
---

:::lang en
## Current status

| Area | Status | Notes |
| ---- | ------ | ----- |
| Solution structure | ✅ Done | Multi-project architecture stabilized |
| Windows launcher runtime | ✅ Done | `DustAET.exe` swap + `DustAET.real.exe` backup |
| Steam compatibility | ✅ Done | The game launches normally through Steam |
| Runtime initialization | ✅ Done | Logs, lifecycle, and folders working |
| Harmony bootstrap | ✅ Done | Runtime patching confirmed and working |
| Mod SDK | ✅ Done | Clean interfaces for mod authors |
| Default patches | ✅ Done | 5 built-in patch modules (see [[Asher/🎯 Project Overview\|🎯 Project Overview]]) |
| Electron manager UI | ✅ Done | `Asher.Electron` + `Asher.Host` is the manager |
| JSONL host | ✅ Done | Headless service for install, mods, and settings |
| Patch Manager | ✅ Done | Enable/disable mods by moving files |
| Game-folder logging | ✅ Done | `runtime_*`, `manager_*`, `launcher_fatal_*` |
| Windows packaging | ✅ Done | NSIS installer + portable zip + `latest.yml` |
| Linux support | ✅ Done | Discovery, install, `LD_PRELOAD` launch, AppImage/tar.gz (validated on WSL2) |
| Emergency uninstall helper | ✅ Done | `Uninstall-Asher.cmd` beside `DustAET.exe` (Windows) |
| Safe vs Total removal | ✅ Done | In-app uninstall vs the emergency script (Windows) |
| In-app GitHub updates | ✅ Done | Packaged builds apply release zips (Windows only) |
| Content patcher | 🔜 Planned | ContentManager interception — no backend yet |
| Mod metadata (`mod.json`) | 🔜 Planned | Description, load order, dependencies |
| Public mod API docs | 🔜 Planned | Developer documentation and examples |
| Install wizard stepper chrome | ⏸️ Deferred | More complete welcome/stepper flow |
| Desktop shortcut | ⏸️ Deferred | Post-install shortcut creation |
| Linux external launch / in-app updater / `.deb` | ⏸️ Deferred | Out of scope for now |

## Current focus

### 🟨 Patch porting & reverse engineering

Porting the remaining gameplay patches from **DustAetPatchingPlatform** into Asher's module architecture (`IAsherPreInitModule`, `IAsherPatchModule`, lifecycle hooks), and validating each one against the real game.

## Backlog

- **Mod metadata** — a `mod.json` schema with description, load order, and dependencies
- **Content patcher** — intercept `ContentManager.Load<T>()` and support `content.json` replacements
- **Mod configuration UI** — per-mod settings files and manager integration
- **Public mod API docs** — developer documentation and examples
- **Customizable Discord Rich Presence**

## Deferred / out of scope

- Content-patcher UI before the backend exists; desktop shortcut creation after install
- Linux: external Steam/desktop launch, in-app updater, `.deb` packaging

## Future possibilities

- An **Avalonia**-based manager UI, which would share the C#/.NET stack instead of shipping a Chromium runtime. Electron is the current implementation.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt
## Status atual

| Área | Status | Notas |
| ---- | ------ | ----- |
| Estrutura da solução | ✅ Feito | Arquitetura multi-projeto estabilizada |
| Runtime com launcher no Windows | ✅ Feito | Troca do `DustAET.exe` + backup `DustAET.real.exe` |
| Compatibilidade com Steam | ✅ Feito | O jogo inicia normalmente pela Steam |
| Inicialização do runtime | ✅ Feito | Logs, ciclo de vida e pastas funcionando |
| Bootstrap do Harmony | ✅ Feito | Patching em runtime confirmado e funcionando |
| SDK de mods | ✅ Feito | Interfaces limpas para autores de mods |
| Patches padrão | ✅ Feito | 5 módulos de patch integrados (ver [[Asher/🎯 Project Overview\|🎯 Project Overview]]) |
| UI Electron do gerenciador | ✅ Feito | `Asher.Electron` + `Asher.Host` é o gerenciador |
| Host JSONL | ✅ Feito | Serviço headless para instalação, mods e settings |
| Patch Manager | ✅ Feito | Ativa/desativa mods movendo arquivos |
| Logs na pasta do jogo | ✅ Feito | `runtime_*`, `manager_*`, `launcher_fatal_*` |
| Empacotamento Windows | ✅ Feito | Instalador NSIS + zip portátil + `latest.yml` |
| Suporte a Linux | ✅ Feito | Descoberta, instalação, launch via `LD_PRELOAD`, AppImage/tar.gz (validado no WSL2) |
| Helper de desinstalação de emergência | ✅ Feito | `Uninstall-Asher.cmd` ao lado do `DustAET.exe` (Windows) |
| Remoção Safe vs Total | ✅ Feito | Uninstall in-app vs script de emergência (Windows) |
| Updates via GitHub in-app | ✅ Feito | Builds empacotadas aplicam zips de release (somente Windows) |
| Content patcher | 🔜 Planejado | Interceptação do ContentManager — ainda sem backend |
| Metadados de mod (`mod.json`) | 🔜 Planejado | Descrição, ordem de carregamento, dependências |
| Documentação pública da API de mods | 🔜 Planejado | Documentação e exemplos para desenvolvedores |
| Chrome do assistente de instalação | ⏸️ Adiado | Fluxo de welcome/stepper mais completo |
| Atalho na área de trabalho | ⏸️ Adiado | Criação de atalho pós-instalação |
| Linux: launch externo / updater in-app / `.deb` | ⏸️ Adiado | Fora de escopo por ora |

## Foco atual

### 🟨 Portabilidade de patches e engenharia reversa

Portar os patches de gameplay restantes do **DustAetPatchingPlatform** para a arquitetura de módulos do Asher (`IAsherPreInitModule`, `IAsherPatchModule`, hooks de ciclo de vida) e validar cada um no jogo real.

## Backlog

- **Metadados de mod** — esquema `mod.json` com descrição, ordem de carregamento e dependências
- **Content patcher** — interceptar `ContentManager.Load<T>()` e suportar substituições via `content.json`
- **UI de configuração de mods** — arquivos de configuração por mod e integração no gerenciador
- **Documentação pública da API de mods** — documentação e exemplos para desenvolvedores
- **Rich Presence do Discord personalizável**

## Adiado / fora de escopo

- UI de content patcher antes de existir backend; criação de atalho após a instalação
- Linux: lançamento externo via Steam/atalho, updater in-app, empacotamento `.deb`

## Possibilidades futuras

- Uma UI de gerenciador baseada em **Avalonia**, que compartilharia a stack C#/.NET em vez de embarcar um runtime Chromium. O Electron é a implementação atual.

---
[[🐱 Asher\|< Voltar]]

:::
