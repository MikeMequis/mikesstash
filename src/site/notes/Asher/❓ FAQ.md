---
{"dg-publish":true,"permalink":"/asher/faq/","title":{"pt":"❓ FAQ","en":"❓ FAQ"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"❓ FAQ","en":"❓ FAQ"}}}
---

:::lang en
Answers to the questions that come up most often about how Asher is built and how it is distributed.

## How much of Asher is AI-assisted?

Asher is a solo project and much of the work — C# services, the runtime and patch modules, the Electron frontend, scripts, and this documentation — is written with AI assistance, primarily **OpenCode**.

That does not mean every line receives the same treatment. Some code is generated and then reviewed, corrected, and validated by hand. Some is written by hand with AI used for investigation or a second opinion. Some is exploratory and gets rewritten. The honest summary is that AI is a constant collaborator, not that it replaces the developer.

## Why use AI?

Asher spans a lot of ground that is slow to do alone: .NET/C# and .NET Framework, Harmony patching, reverse engineering and investigation of a closed game, cross-platform work (Windows and Linux, XNA/FNA/Mono), packaging, and documentation. AI shortens the loop between "what does this do?" and "does this change work?", which matters most for investigation-heavy tasks. It is a practical choice, not a statement about how software should be built.

## Does AI make the project's decisions?

No. Architecture, technical direction, scope, validation, and the decision to accept or reject an approach stay human-directed. AI proposes and implements; the human reviews, tests against the real game, and decides. A change is not accepted just because it compiles or passes a test — the behavior has to be understood and verified.

## Are there downsides?

- AI can introduce unnecessary abstractions or over-engineer a small change.
- It can produce redundant or duplicated documentation.
- It can state incorrect assumptions confidently, so claims need checking against the source.
- Generated code still needs review for readability and long-term maintainability.

These are reasons to keep investigation and real-game testing central, not reasons to avoid AI.

## What is the difference between Distribution and the Installer?

Both are ways to get the same manager application, and both then install Asher into your Dust game folder.

- **Installer** — `Asher-Setup-<version>.exe` (NSIS). A conventional Windows setup that places the manager on your machine and handles the usual install/uninstall bookkeeping. This is the right choice for most players.
- **Distribution (portable zip / `Distribution/` folder)** — the manager as a self-contained folder. Extract it and run `Asher.exe`; nothing is installed system-wide. `npm run dist` also produces a ready-to-use `Distribution/` folder in the repository. Useful for portable setups, quick testing, or keeping everything in one place.

The installer is convenient for a normal desktop, while the portable build is flexible and leaves no system footprint. Linux does not use either — it ships an AppImage and a tar.gz instead.

## Will the manager move to Avalonia?

The manager UI is **Electron** (`Asher.Electron`) today, and there is no migration planned or scheduled. An Avalonia-based UI is a possible future direction: it would let the manager share the C#/.NET stack instead of shipping a complete Chromium runtime.

## What is the difference between a "mod" and a "patch"?

A **patch** is a runtime module that hooks game code with Harmony; a **mod** is how that module is delivered — an ordinary DLL in `Asher/Mods/` that the manager can enable or disable. The built-in `Asher.Patching.*` modules are the shipped patches; they are loaded exactly like any external mod.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt
Respostas para as perguntas mais comuns sobre como o Asher é construído e distribuído.

## Quanto do Asher é assistido por IA?

O Asher é um projeto solo e boa parte do trabalho — serviços em C#, runtime e módulos de patch, frontend Electron, scripts e esta documentação — é escrita com apoio de IA, principalmente o **OpenCode**.

Isso não significa que cada linha recebe o mesmo tratamento. Parte do código é gerada e depois revisada, corrigida e validada à mão. Parte é escrita à mão com a IA usada para investigação ou uma segunda opinião. Parte é exploratória e acaba reescrita. O resumo honesto é que a IA é uma colaboradora constante, não um substituto do desenvolvedor.

## Por que usar IA?

O Asher cobre muita coisa lenta de fazer sozinho: .NET/C# e .NET Framework, patching com Harmony, engenharia reversa e investigação de um jogo fechado, trabalho multiplataforma (Windows e Linux, XNA/FNA/Mono), empacotamento e documentação. A IA encurta o ciclo entre "o que isso faz?" e "essa mudança funciona?", o que mais importa em tarefas de investigação.

## A IA toma as decisões do projeto?

Não. Arquitetura, direção técnica, escopo, validação e a decisão de aceitar ou rejeitar uma abordagem continuam humanas. A IA propõe e implementa; a pessoa revisa, testa no jogo real e decide. Uma mudança não é aceita só porque compila ou passa em um teste — o comportamento precisa ser entendido e verificado.

## Existem desvantagens?

- A IA pode introduzir abstrações desnecessárias ou exagerar em uma mudança pequena.
- Pode produzir documentação redundante ou duplicada.
- Pode afirmar suposições incorretas com confiança, então as alegações precisam ser conferidas na fonte.
- Código gerado ainda precisa de revisão de legibilidade e manutenção no longo prazo.
- Aumenta a exigência de validação, não reduz.

Esses são motivos para manter investigação e testes no jogo real no centro, não motivos para evitar IA.

## Qual é a diferença entre Distribution e o Instalador?

Os dois são formas de obter o mesmo gerenciador e, depois, instalar o Asher na pasta do Dust.

- **Instalador** — `Asher-Setup-<version>.exe` (NSIS). Uma instalação convencional do Windows que coloca o gerenciador na máquina e cuida do registro normal de instalação/desinstalação. É a escolha certa para a maioria dos jogadores.
- **Distribution (zip portátil / pasta `Distribution/`)** — o gerenciador como uma pasta autocontida. Extraia e rode `Asher.exe`; nada é instalado no sistema. O `npm run dist` também gera uma pasta `Distribution/` pronta no repositório. Útil para uso portátil, testes rápidos ou manter tudo em um só lugar.

O instalador é prático para um desktop comum, enquanto o portátil é flexível e não deixa rastro no sistema. O Linux não usa nenhum dos dois — ele distribui um AppImage e um tar.gz.

## O gerenciador vai migrar para Avalonia?

A UI do gerenciador hoje é **Electron** (`Asher.Electron`) e não há migração planejada ou agendada. Uma UI em Avalonia é uma direção futura possível: permitiria ao gerenciador compartilhar a stack C#/.NET em vez de embarcar um runtime Chromium completo.

## Qual é a diferença entre "mod" e "patch"?

Um **patch** é um módulo em runtime que intercepta código do jogo com Harmony; um **mod** é como esse módulo é entregue — uma DLL comum em `Asher/Mods/` que o gerenciador pode ativar ou desativar. Os módulos internos `Asher.Patching.*` são os patches distribuídos; eles são carregados exatamente como qualquer mod externo.

---
[[🐱 Asher\|< Voltar]]

:::
