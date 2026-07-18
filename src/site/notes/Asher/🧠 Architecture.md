---
{"dg-publish":true,"permalink":"/asher/architecture/","dg-note-properties":{"dgShowComments":false}}
---

## Core Architecture (Launcher-First)

Asher is built around a **custom launcher**, which guarantees a deterministic initialization order and reliable runtime behavior.

**Key principle:**  
Injection and patching are **controlled and delayed**, never performed blindly at process startup.

This design mirrors proven approaches used by SMAPI and other stable modding platforms.

A companion **WPF manager app** (`Asher.App`) handles installation, mod management, and user settings without touching the game process directly.

## Solution Structure

```
/Asher.sln
│
├── Asher.App/                  → WPF installer & mod manager (.NET 8, x86)
├── Asher.UserInterface/        → WPF views, view models, theming
├── Asher.Services/             → Installation, launch, patch manager, shortcuts
├── Asher.Core/                 → Paths, settings, shared models
├── Asher.Localization/         → UI strings (en-US, pt-BR)
│
├── Asher.Launcher/             → Custom game launcher (.NET Framework 4.8)
│   └── Program.cs              → Entry point and bootstrap orchestration
│
├── Asher.Runtime/              → Runtime mod loader foundation (.NET Framework 4.8)
│   ├── Bootstrap/
│   │   ├── AssemblyLoader.cs            → Dynamic mod assembly loading
│   │   ├── GameLifecycleHooks.cs        → Game lifecycle event hooks
│   │   ├── GameTitleBootstrap.cs        → Sets game window title
│   │   ├── HarmonyLifecycleBootstrap.cs → Optional lifecycle hook injection
│   │   ├── PreInitBootstrap.cs          → PreInit module discovery & execution
│   │   ├── PatchModuleLoader.cs         → Harmony patch application
│   │   └── LifecycleModuleLoader.cs     → Lifecycle event registration
│   ├── Core/
│   │   ├── GameContext.cs               → Game instance access
│   │   ├── RuntimeContext.cs            → Configuration and paths
│   │   ├── RuntimeController.cs         → Initialization and shutdown
│   │   └── RuntimeResult.cs             → Operation result wrapper
│   ├── Lifecycle/
│   │   ├── LifecycleEvent.cs            → Lifecycle state enum
│   │   └── GameLifecycleEventBus.cs     → Lifecycle state management
│   ├── RuntimeEntry.cs                  → Public runtime API
│   ├── RuntimeLogger.cs                 → File-based logging system
│   └── RuntimeLoggerAdapter.cs          → SDK logger bridge
│
├── Asher.SDK/                  → API for mod developers (.NET Framework 4.8)
│   ├── Logging/
│   │   ├── AsherLog.cs                  → Static logger facade
│   │   └── IAsherLogger.cs              → Logger interface
│   └── Patching/
│       ├── AsherLifecycleModuleBase.cs  → Base class for lifecycle monitoring
│       ├── IAsherLifecycleModule.cs     → Lifecycle event interface
│       ├── IAsherPatchModule.cs         → Harmony patch module interface
│       └── IAsherPreInitModule.cs       → PreInit module interface
│
├── Asher.Patching.*/           → Built-in patch mods (DebugEnabler, IntroSkipper, etc.)
│
├── PrepareDistribution.ps1     → Bundles Distribution/ folder for install & deploy
└── Distribution/               → Output folder (generated, not committed)
```

---
[[🧱 Asher\|< Voltar]]
