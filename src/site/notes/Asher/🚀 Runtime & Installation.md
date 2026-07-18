---
{"dg-publish":true,"permalink":"/asher/runtime-and-installation/","dg-note-properties":{"dgShowComments":false}}
---

## Runtime Flow Overview

### Initialization Sequence

```
1. User launches DustAET.exe via Steam or Asher Manager (Asher.Launcher wrapper)
   ↓
2. Launcher validates game installation
   ↓
3. RuntimeEntry.Init(context)
   ├─> RuntimeLogger initialized
   ├─> Directories prepared (Asher/Mods/, Asher/AsherLogs/)
   └─> Configuration loaded
   ↓
4. Assembly.LoadFrom(DustAET.real.exe)
   ↓
5. AssemblyLoader.LoadAssembliesFrom("Asher/Mods/")
   └─> All *.dll files in Mods/ loaded dynamically
   ↓
6. PreInitBootstrap.ExecutePreInitModules()
   └─> Scans all loaded assemblies for IAsherPreInitModule
   └─> Executes each module's Execute() method
   ↓
7. GameTitleBootstrap.Apply(gameAssembly)
   └─> Sets window title to "Dust - An Elysian Tail (Asher)"
   ↓
8. PatchModuleLoader.Load()
   ├─> Creates Harmony instance ("com.asher.runtime.mods")
   ├─> Scans for IAsherPatchModule implementations
   ├─> Applies each module's patches via Harmony
   ├─> LifecycleModuleLoader.Load()
   └─> HarmonyLifecycleBootstrap.InitializeIfNeeded()
   ↓
9. Dust.Program.Main(args) invoked via Reflection
   ↓
10. Game executes normally with patches applied
```

> **Important:** Launch the game through **Steam** or the manager's **Launch Game** button. Do not run `Asher.Launcher.exe` directly from the distribution folder — it must sit in the game root as `DustAET.exe` with `DustAET.exe.config` probing `Asher` and `Asher\Mods`.

## Installed Game Folder Layout

After installation, the game directory looks like this:

```
/GameFolder/
├── DustAET.exe                  (Asher.Launcher copy — Steam entry point)
├── DustAET.exe.config           (assembly probing: Asher; Asher\Mods)
├── DustAET.real.exe             (original game executable, renamed)
│
└── Asher/
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll             (net472 build — required)
    │
    ├── Mods/                    (active runtime mods)
    │   ├── Asher.Patching.DebugEnabler.dll
    │   ├── Asher.Patching.IntroSkipper.dll
    │   ├── Asher.Patching.GraphicsDeprofiler.dll
    │   ├── Asher.Patching.MuteVoiceActing.dll
    │   ├── Asher.Patching.OverheatDisabler.dll
    │   └── disabled/            (mods disabled via Patch Manager)
    │
    ├── AsherLogs/
    │   └── runtime_YYYYMMDD_HHMMSS.log
    │
    ├── patches/                 (content patcher assets, future)
    ├── Asher.Backup/            (original exe backup)
    │
    └── Asher.App/               (manager app + install payload)
        ├── Asher.App.exe
        ├── settings.json
        ├── Asher.Launcher.exe
        └── DefaultMods/
```

Folders are created automatically during installation.

---
[[🧱 Asher\|< Voltar]]
