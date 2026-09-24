---
{"dg-publish":true,"permalink":"/asher/manager-app/","title":{"pt":"🖥️ Aplicação Gerenciadora","en":"🖥️ Manager App"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🖥️ Aplicação Gerenciadora","en":"🖥️ Manager App"},"navOrder":3}}
---

:::lang en

The Asher manager is an **Electron** application (`Asher.Electron`) backed by **`Asher.Host`**, a headless .NET service that exposes install, uninstall, mod management, and settings over a **JSONL** protocol on stdin/stdout.

> The manager stays in **Distribution** — it is not deployed into the game folder.

## Application flow

1. **Electron main** spawns `Asher.Host.exe --jsonl` and waits for a `ready` event
2. **Renderer** lands on setup, install wizard, or home based on `getApplicationMode` / settings
3. **IPC** forwards method calls (`getSettings`, `install`, `uninstall`, `getMods`, `launchGame`, `markInstalled`, …) to the host
4. **Progress** streams back for long operations (install/uninstall)

## Modes & screens

| Mode | Screens |
|------|---------|
| **Install wizard** | Welcome → Setup (detect/validate game folder) → Installing → Complete (optional launch + minimize) |
| **Manager** | Home hub, Patch Manager, Settings |

Uninstall lives under **Settings → Removal**, not in the sidebar:

| Removal mode | Behavior |
|--------------|----------|
| **Safe uninstallation** | In-app Host uninstall — restores backup, removes runtime files, returns to wizard |
| **Total exclusion** | Launches game-folder `Uninstall-Asher.cmd`, then quits the app so locks clear |

## Features

- **Patch Manager** — enable/disable mods by moving DLLs between `Mods/` and `Mods/disabled/` (rejects unknown mods)
- **Game launch** — starts the game from the configured folder (Windows: `DustAET.exe` launcher wrapper; Linux: native `DustAET` with the `LD_PRELOAD` bootstrap environment)
- **Localization** — en-US, pt-BR, es
- **Theme** — Light / Dark
- **Toasts** — top-right action banners
- **Settings auto-save** — preference-only reset (keeps path / installed state)
- **Always-on install backup** — `BackupEnabled` forced true; not a user toggle
- **Updates** — packaged Distribution builds can check/apply GitHub Release zips (Settings → Check for updates); Windows only
- **Logging** — manager diagnostics in `{GameFolder}/Asher/AsherLogs/manager_*.log` (with `runtime_*` and `launcher_fatal_*`)

## Platform support

The manager is platform-aware through the host contract:

- `getPlatformInfo` — OS capability model (`usesLauncherSwap`, `supportsRecoveryHelper`, executable/library names)
- `getInstallState` — authoritative install status (`state`, `canUninstall`, `canRestore`, `marker`); the renderer derives uninstall/restore from it instead of backup presence
- **Windows:** launcher swap, emergency `Uninstall-Asher.cmd`, GitHub Releases updates
- **Linux:** native `LD_PRELOAD` bootstrap launch, no launcher swap; "Total exclusion" and the in-app updater are hidden (unsupported)

Linux packaging: `npm run dist:linux` (AppImage + tar.gz); Linux dependencies are listed in `docs/Cross-Platform-Architecture.md`.

## Development

```bash
cd Asher.Electron
npm install
npm run build:host:debug   # or build:host for Release/dist
npm start
```

Smoke tests: `npm run smoke`, `npm run smoke:install`, `npm run smoke:uninstall`, etc.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

O gerenciador Asher é uma aplicação **Electron** (`Asher.Electron`) apoiada pelo **`Asher.Host`**, um serviço .NET headless que expõe instalação, desinstalação, gerenciamento de mods e configurações via protocolo **JSONL** em stdin/stdout.

> O gerenciador permanece em **Distribution** — não é implantado na pasta do jogo.

## Fluxo da aplicação

1. **Electron main** inicia `Asher.Host.exe --jsonl` e aguarda o evento `ready`
2. **Renderer** abre setup, assistente de instalação ou home conforme `getApplicationMode` / settings
3. **IPC** encaminha chamadas (`getSettings`, `install`, `uninstall`, `getMods`, `launchGame`, `markInstalled`, …) ao host
4. **Progresso** é transmitido em operações longas (instalar/desinstalar)

## Modos e telas

| Modo | Telas |
|------|-------|
| **Assistente de instalação** | Welcome → Setup (detectar/validar pasta) → Installing → Complete (launch opcional + minimizar) |
| **Gerenciador** | Home hub, Patch Manager, Settings |

A desinstalação fica em **Settings → Removal**, não na barra lateral:

| Modo de remoção | Comportamento |
|-----------------|---------------|
| **Desinstalação segura** | Uninstall in-app via Host — restaura backup, remove runtime, volta ao wizard |
| **Exclusão total** | Executa `Uninstall-Asher.cmd` na pasta do jogo e encerra o app para liberar locks |

## Recursos

- **Patch Manager** — ativa/desativa mods movendo DLLs entre `Mods/` e `Mods/disabled/` (rejeita mods inexistentes)
- **Inicialização do jogo** — inicia o jogo da pasta configurada (Windows: wrapper `DustAET.exe`; Linux: `DustAET` nativo com o ambiente `LD_PRELOAD`)
- **Localização** — en-US, pt-BR, es
- **Tema** — Light / Dark
- **Toasts** — banners no canto superior direito
- **Auto-save de settings** — reset só de preferências (mantém caminho / instalado)
- **Backup sempre ativo na instalação** — `BackupEnabled` forçado; não é toggle
- **Atualizações** — builds empacotadas em Distribution podem checar/aplicar zips do GitHub Releases; somente Windows
- **Logs** — diagnósticos em `{GameFolder}/Asher/AsherLogs/manager_*.log` (com `runtime_*` e `launcher_fatal_*`)

## Suporte de plataforma

O gerenciador é ciente da plataforma através do contrato do host:

- `getPlatformInfo` — modelo de capacidades do SO (`usesLauncherSwap`, `supportsRecoveryHelper`, nomes de executáveis/bibliotecas)
- `getInstallState` — status de instalação autoritativo (`state`, `canUninstall`, `canRestore`, `marker`); o renderer deriva desinstalação/restauração dele em vez da presença de backup
- **Windows:** troca de launcher, `Uninstall-Asher.cmd` de emergência, updates via GitHub Releases
- **Linux:** lançamento nativo via bootstrap `LD_PRELOAD`, sem troca de launcher; "Exclusão total" e o updater in-app ficam ocultos (não suportados)

Empacotamento Linux: `npm run dist:linux` (AppImage + tar.gz); dependências Linux em `docs/Cross-Platform-Architecture.md`.

## Desenvolvimento

```bash
cd Asher.Electron
npm install
npm run build:host:debug
npm start
```

Testes de fumaça: `npm run smoke`, `npm run smoke:install`, `npm run smoke:uninstall`, etc.

---
[[🐱 Asher\|< Voltar]]

:::
