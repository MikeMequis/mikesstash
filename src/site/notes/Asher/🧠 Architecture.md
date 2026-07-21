---
{"dg-publish":true,"permalink":"/asher/architecture/","title":{"pt":"🧠 Arquitetura","en":"🧠 Architecture"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🧠 Arquitetura","en":"🧠 Architecture"}}}
---

:::lang en
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
├── Asher.Launcher/             → Custom game launcher (.NET Framework 4.7.2)
│   └── Program.cs              → Entry point and bootstrap orchestration
│
├── Asher.Runtime/              → Runtime mod loader foundation (.NET Framework 4.7.2)
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
├── Asher.SDK/                  → API for mod developers (.NET Framework 4.7.2)
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
[[🧱 Asher\|< Back]]

:::

:::lang pt

## Arquitetura Central (Launcher-First)

O Asher é construído em torno de um **launcher personalizado**, que garante uma ordem de inicialização determinística e um comportamento confiável em tempo de execução. 

**Princípio-chave:** 
A injeção e a aplicação de patches são **controladas e postergada**s, nunca realizadas às cegas na inicialização do processo. 

Esse design espelha abordagens comprovadas usadas pelo SMAPI e outras plataformas de modding estáveis. 

Um **app gerenciador WPF** complementar (`Asher.App`) cuida da instalação, do gerenciamento de mods e das configurações do usuário sem tocar diretamente no processo do jogo. 

## Estrutura da Solução

```
/Asher.sln
│
├── Asher.App/                  → Instalador WPF e gerenciador de mods (.NET 8, x86)
├── Asher.UserInterface/        → Views, view models e temas do WPF
├── Asher.Services/             → Instalação, inicialização, patch manager, atalhos
├── Asher.Core/                 → Caminhos, configurações, modelos compartilhados
├── Asher.Localization/         → Strings da interface (en-US, pt-BR)
│
├── Asher.Launcher/             → Launcher personalizado do jogo (.NET Framework 4.7.2)
│   └── Program.cs              → Ponto de entrada e orquestração do bootstrap
│
├── Asher.Runtime/              → Base do carregador de mods em tempo de execução (.NET Framework 4.7.2)
│   ├── Bootstrap/
│   │   ├── AssemblyLoader.cs            → Carregamento dinâmico de assemblies de mods
│   │   ├── GameLifecycleHooks.cs        → Hooks de eventos do ciclo de vida do jogo
│   │   ├── GameTitleBootstrap.cs        → Define o título da janela do jogo
│   │   ├── HarmonyLifecycleBootstrap.cs → Injeção opcional de hooks de ciclo de vida
│   │   ├── PreInitBootstrap.cs          → Descoberta e execução de módulos PreInit
│   │   ├── PatchModuleLoader.cs         → Aplicação de patches via Harmony
│   │   └── LifecycleModuleLoader.cs     → Registro de eventos de ciclo de vida
│   ├── Core/
│   │   ├── GameContext.cs               → Acesso à instância do jogo
│   │   ├── RuntimeContext.cs            → Configuração e caminhos
│   │   ├── RuntimeController.cs         → Inicialização e encerramento
│   │   └── RuntimeResult.cs             → Wrapper de resultado de operação
│   ├── Lifecycle/
│   │   ├── LifecycleEvent.cs            → Enum de estado do ciclo de vida
│   │   └── GameLifecycleEventBus.cs     → Gerenciamento de estado do ciclo de vida
│   ├── RuntimeEntry.cs                  → API pública do runtime
│   ├── RuntimeLogger.cs                 → Sistema de logging baseado em arquivo
│   └── RuntimeLoggerAdapter.cs          → Ponte de logger para o SDK
│
├── Asher.SDK/                  → API para desenvolvedores de mods (.NET Framework 4.7.2)
│   ├── Logging/
│   │   ├── AsherLog.cs                  → Fachada estática de logger
│   │   └── IAsherLogger.cs              → Interface de logger
│   └── Patching/
│       ├── AsherLifecycleModuleBase.cs  → Classe base para monitoramento de ciclo de vida
│       ├── IAsherLifecycleModule.cs     → Interface de eventos de ciclo de vida
│       ├── IAsherPatchModule.cs         → Interface de módulo de patch Harmony
│       └── IAsherPreInitModule.cs       → Interface de módulo PreInit
│
├── Asher.Patching.*/           → Mods de patch integrados (DebugEnabler, IntroSkipper, etc.)
│
├── PrepareDistribution.ps1     → Empacota a pasta Distribution/ para instalação e implantação
└── Distribution/               → Pasta de saída (gerada, não commitada)

```

[[🧱 Asher\|< Voltar]]

:::