---
{"dg-publish":true,"permalink":"/asher/runtime-and-installation/","title":{"pt":"🚀 Runtime & Instalação","en":"🚀 Runtime & Installation"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🚀 Runtime & Instalação","en":"🚀 Runtime & Installation"},"navOrder":4}}
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

> **Important (Windows):** Launch the game through **Steam** or the manager's **Launch Game** button. Do not run `Asher.Launcher.exe` directly from the distribution folder — it must sit in the game root as `DustAET.exe` with `DustAET.exe.config` probing `Asher` and `Asher\Mods`. On Linux the executable is not replaced; see the Linux section below.

## Installed Game Folder Layout

After installation, the game directory looks like this:

```
/GameFolder/
├── DustAET.exe                  (Asher.Launcher copy — Steam entry point)
├── DustAET.exe.config           (assembly probing: Asher; Asher\Mods)
├── DustAET.real.exe             (original game executable, renamed)
├── Uninstall-Asher.cmd          (emergency restore without the UI)
├── Uninstall-Asher.ps1
│
└── Asher/
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll             (net472 build — required)
    ├── LEIA-ME.txt              (generated on install)
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
    │   ├── runtime_YYYYMMDD_HHMMSS.log
    │   ├── manager_YYYYMMDD_HHMMSS.log
    │   └── launcher_fatal_YYYYMMDD_HHMMSS.log
    │
    ├── patches/                 (content patcher assets, future)
    └── Asher.Backup/            (original exe backup — always created on install)
```

The **manager UI** lives in the packaged `Distribution/` folder (or extracted zip), not inside the game's `Asher/` folder. Install payload is staged beside `Asher.Host.exe` as `install-payload/` (Launcher, Runtime, SDK, Harmony, default mods).
Folders are created automatically during installation.

## Linux (embedded Mono)

On Linux the game executable is left untouched: Asher attaches to the Mono runtime embedded in `DustAET` through `libasher_bootstrap.so` (via `LD_PRELOAD`).

```
1. Manager installs Asher into <game>/Asher (bootstrap + runtime + mods + install.json)
   ↓
2. Manager launches the native DustAET with the bootstrap environment:
   LD_PRELOAD=<game>/Asher/libasher_bootstrap.so
   ASHER_HOME / ASHER_MODS_PATH / ASHER_LOG_PATH / ASHER_PROFILE / MONO_PATH
   ↓
3. libasher_bootstrap.so attaches to Dust's Mono runtime (mono_get_root_domain / mono_thread_attach)
   ↓
4. Asher.Runtime.RuntimeBootstrap.Initialize() → AssemblyLoader → PreInit → PatchModuleLoader (Harmony)
   ↓
5. Dust runs with patches applied; per-module results in Asher/AsherLogs/runtime_*.log
```

The game's stdout/stderr are redirected off the manager's JSONL channel; the runtime's own logs stay in `Asher/AsherLogs/`.

The bootstrap waits `ASHER_BOOTSTRAP_SETTLE_MS` (default `1000`) after `mono_get_root_domain` before calling `mono_thread_attach`, so it never attaches while Mono is still initializing (avoids the `object.c:1938 'klass' not met` crash).

### Installed layout (Linux)

```
/GameFolder/
├── DustAET                     (native ELF — unchanged)
└── Asher/
    ├── libasher_bootstrap.so   (install marker)
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll
    ├── install.json            (manifest: version + ELF architecture)
    ├── LEIA-ME.txt
    ├── Mods/                   (active runtime mods + disabled/)
    └── AsherLogs/
```

There is no launcher swap and no backup on Linux (game files are never modified); uninstall removes only the `Asher/` files.

---

[[🐱 Asher\|< Back]]

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

>**Importante (Windows)**: Inicie o jogo pela **Steam** ou pelo botão **Launch Game** da aplicação. Não execute o `Asher.Launcher.exe` diretamente da pasta de distribuição — ele precisa estar na raiz do jogo como `DustAET.exe`, com o `DustAET.exe.config` fazendo probing em `Asher` e `Asher\Mods`. No Linux o executável não é substituído; veja a seção Linux abaixo.

# Estrutura da Pasta do Jogo Instalado 

Após a instalação, o diretório do jogo fica assim:

```
/GameFolder/
├── DustAET.exe                  (cópia do Asher.Launcher — ponto de entrada da Steam)
├── DustAET.exe.config           (probing de assemblies: Asher; Asher\Mods)
├── DustAET.real.exe             (executável original do jogo, renomeado)
├── Uninstall-Asher.cmd          (restauração de emergência sem a UI)
├── Uninstall-Asher.ps1
│
└── Asher/
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll             (build net472 — obrigatória)
    ├── LEIA-ME.txt              (gerado na instalação)
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
    │   ├── runtime_YYYYMMDD_HHMMSS.log
    │   ├── manager_YYYYMMDD_HHMMSS.log
    │   └── launcher_fatal_YYYYMMDD_HHMMSS.log
    │
    ├── patches/                 (assets do content patcher, futuro)
    └── Asher.Backup/            (backup do exe original — sempre criado na instalação)
```

A **UI do gerenciador** fica na pasta empacotada `Distribution/` (ou zip extraído), não dentro da pasta `Asher/` do jogo. O payload de instalação fica ao lado de `Asher.Host.exe` como `install-payload/` (Launcher, Runtime, SDK, Harmony, mods padrão).
As pastas são criadas automaticamente durante a instalação. 

# Linux (Mono embutido)

No Linux o executável do jogo permanece intacto: o Asher se conecta ao runtime Mono embutido no `DustAET` através do `libasher_bootstrap.so` (via `LD_PRELOAD`).

```
1. O gerenciador instala o Asher em <game>/Asher (bootstrap + runtime + mods + install.json)
   ↓
2. O gerenciador inicia o DustAET nativo com o ambiente do bootstrap:
   LD_PRELOAD=<game>/Asher/libasher_bootstrap.so
   ASHER_HOME / ASHER_MODS_PATH / ASHER_LOG_PATH / ASHER_PROFILE / MONO_PATH
   ↓
3. libasher_bootstrap.so se conecta ao Mono do Dust (mono_get_root_domain / mono_thread_attach)
   ↓
4. Asher.Runtime.RuntimeBootstrap.Initialize() → AssemblyLoader → PreInit → PatchModuleLoader (Harmony)
   ↓
5. O Dust roda com os patches aplicados; resultados por módulo em Asher/AsherLogs/runtime_*.log
```

O stdout/stderr do jogo são redirecionados para fora do canal JSONL do gerenciador; os logs do runtime permanecem em `Asher/AsherLogs/`.

O bootstrap aguarda `ASHER_BOOTSTRAP_SETTLE_MS` (padrão `1000`) após `mono_get_root_domain` antes de chamar `mono_thread_attach`, evitando anexar enquanto o Mono ainda está inicializando (previne o crash `object.c:1938 'klass' not met`).

## Estrutura instalada (Linux)

```
/GameFolder/
├── DustAET                     (ELF nativo — inalterado)
└── Asher/
    ├── libasher_bootstrap.so   (marcador de instalação)
    ├── Asher.Runtime.dll
    ├── Asher.SDK.dll
    ├── 0Harmony.dll
    ├── install.json            (manifesto: versão + arquitetura ELF)
    ├── LEIA-ME.txt
    ├── Mods/                   (mods ativos + disabled/)
    └── AsherLogs/
```

Não há troca de launcher nem backup no Linux (os arquivos do jogo nunca são modificados); a desinstalação remove apenas os arquivos de `Asher/`.

---

[[🐱 Asher\|< Voltar]]

:::
