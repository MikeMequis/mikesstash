---
{"dg-publish":true,"permalink":"/asher/runtime-and-installation/","title":{"pt":"🚀 Runtime & Instalação","en":"🚀 Runtime & Installation"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🚀 Runtime & Instalação","en":"🚀 Runtime & Installation"}}}
---

:::lang en
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
[[🧱 Asher\|< Back]]

:::

:::lang pt
## Visão Geral do Fluxo de Execução 
### Sequência de Inicialização

```
1. Usuário inicia o DustAET.exe via Steam ou Asher Manager (wrapper Asher.Launcher)
   ↓
2. Launcher valida a instalação do jogo
   ↓
3. RuntimeEntry.Init(context)
   ├─> RuntimeLogger inicializado
   ├─> Diretórios preparados (Asher/Mods/, Asher/AsherLogs/)
   └─> Configuração carregada
   ↓
4. Assembly.LoadFrom(DustAET.real.exe)
   ↓
5. AssemblyLoader.LoadAssembliesFrom("Asher/Mods/")
   └─> Todos os arquivos *.dll em Mods/ são carregados dinamicamente
   ↓
6. PreInitBootstrap.ExecutePreInitModules()
   └─> Varre todos os assemblies carregados em busca de IAsherPreInitModule
   └─> Executa o método Execute() de cada módulo
   ↓
7. GameTitleBootstrap.Apply(gameAssembly)
   └─> Define o título da janela como "Dust - An Elysian Tail (Asher)"
   ↓
8. PatchModuleLoader.Load()
   ├─> Cria a instância do Harmony ("com.asher.runtime.mods")
   ├─> Varre em busca de implementações de IAsherPatchModule
   ├─> Aplica os patches de cada módulo via Harmony
   ├─> LifecycleModuleLoader.Load()
   └─> HarmonyLifecycleBootstrap.InitializeIfNeeded()
   ↓
9. Dust.Program.Main(args) invocado via Reflection
   ↓
10. O jogo é executado normalmente com os patches aplicados

```

>**Importante**: Inicie o jogo pela **Steam** ou pelo botão **Launch Game** da aplicação. Não execute o `Asher.Launcher.exe` diretamente da pasta de distribuição — ele precisa estar na raiz do jogo como `DustAET.exe`, com o `DustAET.exe.config` fazendo probing em `Asher` e `Asher\Mods`. 

# Estrutura da Pasta do Jogo Instalado 

Após a instalação, o diretório do jogo fica assim:

```
/GameFolder/
├── DustAET.exe                  (cópia do Asher.Launcher — ponto de entrada da Steam)
├── DustAET.exe.config           (probing de assemblies: Asher; Asher\Mods)
├── DustAET.real.exe             (executável original do jogo, renomeado)
│
└── Asher/
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll             (build net472 — obrigatória)
    │
    ├── Mods/                    (mods ativos em tempo de execução)
    │   ├── Asher.Patching.DebugEnabler.dll
    │   ├── Asher.Patching.IntroSkipper.dll
    │   ├── Asher.Patching.GraphicsDeprofiler.dll
    │   ├── Asher.Patching.MuteVoiceActing.dll
    │   ├── Asher.Patching.OverheatDisabler.dll
    │   └── disabled/            (mods desativados via Patch Manager)
    │
    ├── AsherLogs/
    │   └── runtime_YYYYMMDD_HHMMSS.log
    │
    ├── patches/                 (assets do content patcher, futuro)
    ├── Asher.Backup/            (backup do exe original)
    │
    └── Asher.App/               (app gerenciador + payload de instalação)
        ├── Asher.App.exe
        ├── settings.json
        ├── Asher.Launcher.exe
        └── DefaultMods/

```

As pastas são criadas automaticamente durante a instalação. 

---
[[🧱 Asher\|< Voltar]]

:::
