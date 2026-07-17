---
{"dg-publish":true,"permalink":"/asher/status-and-roadmap/","dg-note-properties":{}}
---

## Project Status Overview

| Area                      | Status      | Notes                                          |
| ------------------------- | ----------- | ---------------------------------------------- |
| Solution structure        | ✅ Done     | Multi-project architecture stabilized          |
| Launcher-based runtime    | ✅ Done     | Wrapper EXE approach validated                 |
| Steam compatibility       | ✅ Done     | Game launches normally via Steam               |
| Runtime initialization    | ✅ Done     | Logs, lifecycle and folders working            |
| Injection strategy        | ✅ Done     | No blind injection, controlled bootstrap       |
| Harmony bootstrap         | ✅ Done     | Runtime patching confirmed and working         |
| PreInit system            | ✅ Done     | Flag configuration before patches              |
| Lifecycle hooks           | ✅ Done     | Optional event system for game lifecycle       |
| Mod SDK                   | ✅ Done     | Clean interfaces for mod developers            |
| First gameplay patch      | ✅ Done     | Debug Menu Enabler working                     |
| External mod loader       | ✅ Done     | Dynamic .dll loading from Asher/Mods/          |
| **Installer / Manager UI**| ✅ Done     | WPF app with install wizard & mod manager      |
| **Patch Manager UI**      | ✅ Done     | Enable/disable mods via folder move            |
| **Localization**          | ✅ Done     | English and Portuguese (Brazil)                |
| **Light / Dark theme**    | ✅ Done     | Full-window Material Design theming            |
| **Game window title**     | ✅ Done     | Shows "Dust - An Elysian Tail (Asher)"         |
| Content patcher           | 🔜 Planned  | XNA ContentManager interception                |
| Mod metadata (json)       | 🔜 Planned  | mod.json for description, dependencies, etc.   |
| Public Mod API docs       | 🔜 Planned  | Developer documentation and examples           |

## Learning & Implementation Kanban

### 🟢 DONE — Consolidated Phases

#### 🟢 Task 0 — Core Architecture & Bootstrap
**Status:** ✔ Completed

**Deliverables achieved:**
- Stable multi-project solution architecture
- Clear separation between Launcher, Runtime, SDK, and Manager App
- Wrapper EXE approach validated:
  - `DustAET.exe` → Asher Launcher
  - `DustAET.real.exe` → original game executable
- Full Steam compatibility preserved
- Explicit runtime initialization order guaranteed

#### 🟢 Task 1 — Runtime Modding Foundations
**Status:** ✔ Completed

**Concepts mastered:**
- Generics (used for Asher infrastructure)
- Reflection (runtime inspection, private member access)
- Harmony (Prefix / Postfix / Transpiler patterns)

**Key decisions locked in:**
- Harmony is the official runtime patch engine
- No permanent modification of game binaries or `.xnb` files

#### 🟢 Task 2 — Launcher-Based Runtime Control
**Status:** ✔ Completed

- Custom launcher fully controls game startup
- Runtime initialization occurs before game execution
- Logging, folders, and context prepared deterministically
- Runtime survives Steam launches transparently

#### 🟢 Task 3 — Module System Architecture
**Status:** ✔ Completed

1. **PreInit System** — configuration before patches
2. **Patch System** — Harmony patch application via `IAsherPatchModule`
3. **Lifecycle System** — optional game event hooks

#### 🟢 Task 4 — First Runtime Patch (Debug Enabler)
**Status:** ✔ Completed ✨

- First working gameplay patch: **Debug Menu Enabler**
- PreInit → Patch → Lifecycle flow validated

#### 🟢 Task 5 — Installer & Manager App
**Status:** ✔ Completed

**What was implemented:**
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

Port and modernize existing gameplay patches from **DustAetPatchingPlatform** into the Asher runtime architecture.

**Current workflow:**
1. Analyze original patch behavior
2. Inspect game internals using **dnSpy** when required
3. Reimplement using `IAsherPreInitModule`, `IAsherPatchModule`, and optional lifecycle hooks
4. Validate with runtime logs

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
- Validate dependency graph on load
- Automatic load order resolution

---
*Last Updated: July 2, 2026*
[[🧱 Asher\|< Voltar]]
