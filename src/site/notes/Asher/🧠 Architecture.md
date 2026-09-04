---
{"dg-publish":true,"permalink":"/asher/architecture/","title":{"pt":"🧠 Arquitetura","en":"🧠 Architecture"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🧠 Arquitetura","en":"🧠 Architecture"}}}
---

:::lang en
## Core Architecture (Launcher-First)

Asher is built around a **custom launcher**, which guarantees a deterministic initialization order and reliable runtime behavior.

**Key principle:**  
Injection and patching are **controlled and delayed**, never performed blindly at process startup.

A companion **Electron manager app** (`Asher.Electron`) handles installation, mod management, and user settings. It talks to **`Asher.Host`** over JSONL on stdin/stdout — the host wraps `IAsherApplication` / `Asher.Services` without starting a UI or touching the game process directly.

> **Note:** The legacy WPF app (`Asher.App`) was retired in September 2026. Electron + `Asher.Host` is the only manager UI. The manager stays in **Distribution**; the game folder receives runtime files + an emergency uninstall helper only.

## Solution Structure

```
/Asher.sln
│
├── Asher.Electron/             → Electron manager UI (HTML/CSS/JS)
│   ├── src/main/               → Spawns Asher.Host, JSONL IPC, updates
│   ├── src/preload/            → contextBridge → window.asher
│   └── src/renderer/           → Controllers, localization, theme, icons
│
├── Asher.Host/                 → Headless JSONL service host (.NET 8, x86)
│   └── Jsonl/JsonlHostSession  → install, uninstall, mods, settings RPC
│
├── Asher.Services/             → IAsherApplication + install/launch/patch manager
├── Asher.Core/                 → Paths, settings, shared models (no UI types)
│
├── Asher.Launcher/             → Custom game launcher (.NET Framework 4.7.2)
│   └── Program.cs              → Entry point and bootstrap orchestration
│
├── Asher.Runtime/              → Runtime mod loader foundation (.NET Framework 4.7.2)
│   ├── Bootstrap/              → AssemblyLoader, PreInit, Patch, Lifecycle
│   ├── Core/                   → RuntimeContext, RuntimeController
│   ├── RuntimeLogger.cs        → File logging to Asher/AsherLogs/
│   └── RuntimeEntry.cs         → Public runtime API
│
├── Asher.SDK/                  → API for mod developers (.NET Framework 4.7.2)
│   ├── Logging/                → AsherLog facade
│   └── Patching/               → IAsherPatchModule, IAsherPreInitModule, lifecycle
│
├── Asher.Patching.*/           → Built-in patch mods
│   ├── DebugEnabler
│   ├── IntroSkipper
│   ├── GraphicsDeprofiler
│   ├── MuteVoiceActing
│   └── OverheatDisabler
│
└── Distribution/               → Zip/dir packaging output (npm run dist)
```

## Manager ↔ Host Communication

```
Asher.Electron (renderer)
    ↓ IPC
Asher.Electron (main / HostManager)
    ↓ spawn + JSONL on stdin/stdout
Asher.Host --jsonl
    ↓
IAsherApplication → Asher.Services / Asher.Core
```

Progress operations (`install`, `uninstall`) stream `progress` events over stdout. The host session guards against late progress callbacks after an operation completes to keep uninstall→reinstall flows stable in a single session.

In-game stack (separate process): `DustAET.exe` (= Asher.Launcher) → Asher.Runtime → Asher.Patching.*.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

## Arquitetura Central (Launcher-First)

O Asher é construído em torno de um **launcher personalizado**, que garante uma ordem de inicialização determinística e um comportamento confiável em tempo de execução.

**Princípio-chave:**  
A injeção e a aplicação de patches são **controladas e postergadas**, nunca realizadas às cegas na inicialização do processo.

Um **app gerenciador Electron** complementar (`Asher.Electron`) cuida da instalação, do gerenciamento de mods e das configurações do usuário. Ele se comunica com o **`Asher.Host`** via JSONL em stdin/stdout — o host encapsula `IAsherApplication` / `Asher.Services` sem iniciar UI nem tocar diretamente no processo do jogo.

> **Nota:** O app WPF legado (`Asher.App`) foi descontinuado em setembro de 2026. Electron + `Asher.Host` é a única UI do gerenciador. O gerenciador permanece em **Distribution**; a pasta do jogo recebe só runtime + helper de desinstalação de emergência.

## Estrutura da Solução

```
/Asher.sln
│
├── Asher.Electron/             → UI do gerenciador Electron (HTML/CSS/JS)
│   ├── src/main/               → Inicia Asher.Host, ponte IPC JSONL, updates
│   ├── src/preload/            → contextBridge → window.asher
│   └── src/renderer/           → Controllers, localização, tema, ícones
│
├── Asher.Host/                 → Host de serviços JSONL headless (.NET 8, x86)
│   └── Jsonl/JsonlHostSession  → RPC de instalação, desinstalação, mods, settings
│
├── Asher.Services/             → IAsherApplication + instalação/launch/patch manager
├── Asher.Core/                 → Caminhos, configurações, modelos (sem tipos de UI)
│
├── Asher.Launcher/             → Launcher personalizado do jogo (.NET Framework 4.7.2)
├── Asher.Runtime/              → Base do carregador de mods em tempo de execução
├── Asher.SDK/                  → API para desenvolvedores de mods
├── Asher.Patching.*/           → Mods integrados (DebugEnabler, IntroSkipper, etc.)
└── Distribution/               → Saída zip/dir (npm run dist)
```

## Comunicação Gerenciador ↔ Host

```
Asher.Electron (renderer)
    ↓ IPC
Asher.Electron (main / HostManager)
    ↓ spawn + JSONL em stdin/stdout
Asher.Host --jsonl
    ↓
IAsherApplication → Asher.Services / Asher.Core
```

Operações com progresso (`install`, `uninstall`) enviam eventos `progress` pelo stdout. A sessão do host bloqueia callbacks de progresso tardios após a conclusão da operação, mantendo fluxos de desinstalar→reinstalar estáveis na mesma sessão.

Stack in-game (processo separado): `DustAET.exe` (= Asher.Launcher) → Asher.Runtime → Asher.Patching.*.

[[🐱 Asher\|< Voltar]]

:::
