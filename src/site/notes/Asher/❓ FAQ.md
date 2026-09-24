---
{"dg-publish":true,"permalink":"/asher/faq/","title":{"pt":"❓ FAQ","en":"❓ FAQ"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"❓ FAQ","en":"❓ FAQ"},"navOrder":7}}
---

:::lang en

## What's the difference between a "mod" and a "patch"?

A **patch** is a runtime module that hooks game code with Harmony, while a **mod** is the package or DLL that is loaded by Asher from `Asher/Mods/`. Asher's built-in `Asher.Patching.*` modules are patches, while externally developed DLLs can be distributed as mods and use the same runtime loading mechanism.

## What's the difference between Distribution and Installer?

Both are ways to get the same manager application, and both then install Asher into your Dust game folder.

- **Installer** — `Asher-Setup-<version>.exe` (NSIS). A conventional Windows setup that places the manager on your machine and handles the usual install/uninstall bookkeeping. This is the normal installation option.
    
- **Distribution (portable zip / `Distribution/` folder)** — the manager as a self-contained folder. Extract it and run `Asher.exe`; nothing is installed system-wide. `npm run dist` also produces a ready-to-use `Distribution/` folder in the repository.
    

The two versions are currently Windows distribution options for the same manager. Linux is distributed separately as an AppImage and a tar.gz.

## Why did you transition from WPF (v1.0) to Electron (v2.0)?

Originally, the application was supposed to be solely **portable**: a single executable that takes care of the installation process and launches the game afterwards, similar to [UnleashedRecomp](https://github.com/hedge-dev/UnleashedRecomp) and [Dusklight](https://github.com/TwilitRealm/dusklight).

The first version was not only **tightly coupled** to its user interface and interaction model, but was also exclusively functional on Windows. That's where Electron came into play: **cross-platform** capabilities and features such as **in-app updates**. However, because Electron's update mechanism works with locally installed applications, the installer was created.

... Until I found out that Avalonia could do the exact same thing with a portable application.

## How much of Asher is AI-assisted?

**Development is heavily AI-assisted**, primarily through **OpenCode**, and I'm open about that. Asher is a solo project, and AI is involved in a lot of the work: writing and refactoring C# code, investigating the game's behavior, working through unfamiliar parts of the codebase, testing ideas, debugging, and writing documentation.

That doesn't mean the project is generated from a single prompt or that every change follows the same process. OpenCode sometimes writes a larger piece of code that I review and modify. I often use it to investigate a problem and structure the core of a new feature before writing the implementation myself. That also includes exploring new tools and technologies that I discover during the development of the project.

## Why use AI?

Asher covers a lot of ground for a solo project: C# and different .NET runtimes, Harmony patching, reverse engineering and investigation of a closed-source game, XNA/Mono/FNA, Windows and Linux, packaging, and documentation. AI makes that work more **practical** for one person. It is particularly useful when exploring other projects, inspecting an assembly, running tests, or investigating an unfamiliar technology and using what I learn to decide what to keep. It simply makes the loop between investigating a problem and trying an effective solution much shorter.

## Does AI make the project's decisions? In other words, is this project lazily vibe-coded?

**No**. OpenCode suggests different approaches, explains problems, or implements changes, but its output is not always considered the most appropriate solution. I often choose the simplest or clearest approach, and decide what belongs in Asher and what should be kept, changed, or removed. When something affects the game, it is checked against Dust's actual behavior. This project is not only an environment for experimentation, but also an opportunity to find new tools and expand the modding possibilities for Dust. That explains the constant transitions between UI-related technologies and cross-platform approaches.

What started as a simple user interface mod manager for patches from [DustAetPatchingPlatform](https://github.com/GMMan/DustAetPatchingPlatform) turned into a new platform for both users and developers.

## Are there downsides to using AI?

**Yes**. AI can over-engineer a simple change, introduce abstractions that are not really needed, duplicate documentation, or make core changes that turn out to be wrong. Generated code can also work correctly while still being harder to understand or maintain than it needs to be. Using AI means spending time checking what it produces, simplifying things when necessary, and making sure the project still makes sense as a whole.

The goal is not to have AI write as much code as possible; it's to use it to make a difficult solo project more feasible while keeping the architecture and direction under human control.

---

[[🐱 Asher\|< Back]]

:::

:::lang pt

## Qual é a diferença entre um "mod" e um "patch"?

Um **patch** é um módulo em runtime que intercepta o código do jogo usando Harmony, enquanto um **mod** é o pacote ou DLL carregado pelo Asher a partir de `Asher/Mods/`. Os módulos internos `Asher.Patching.*` do Asher são patches, enquanto DLLs desenvolvidas externamente podem ser distribuídas como mods e usar o mesmo mecanismo de carregamento em runtime.

## Qual é a diferença entre Distribution e Instalador?

Os dois são formas de obter o mesmo gerenciador e, depois, instalar o Asher na pasta do seu jogo Dust.

- **Instalador** — `Asher-Setup-<version>.exe` (NSIS). Uma instalação convencional do Windows que coloca o gerenciador na sua máquina e cuida do processo normal de instalação/desinstalação. Esta é a opção de instalação normal.
    
- **Distribution (zip portátil / pasta `Distribution/`)** — o gerenciador como uma pasta autocontida. Extraia e execute `Asher.exe`; nada é instalado no sistema. O `npm run dist` também produz uma pasta `Distribution/` pronta para uso no repositório.
    

As duas versões são atualmente opções de distribuição para Windows do mesmo gerenciador. O Linux é distribuído separadamente como um AppImage e um tar.gz.

## Por que você fez a transição do WPF (v1.0) para o Electron (v2.0)?

Originalmente, a aplicação deveria ser exclusivamente **portátil**: um único executável que cuidaria do processo de instalação e iniciaria o jogo depois, de forma semelhante ao [UnleashedRecomp](https://github.com/hedge-dev/UnleashedRecomp) e ao [Dusklight](https://github.com/TwilitRealm/dusklight).

A primeira versão não somente era **fortemente acoplada** à interface e ao modelo de interação, mas funcionava exclusivamente no Windows. Foi aí que o Electron entrou no projeto: recursos de **multiplataforma** e funcionalidades como **atualizações dentro da aplicação**. No entanto, como o mecanismo de atualização do Electron funciona com aplicações instaladas localmente, o instalador foi criado.

... Até eu descobrir que o Avalonia conseguia fazer exatamente a mesma coisa com uma aplicação portátil.

## Quanto do Asher é assistido por IA?

**O desenvolvimento é fortemente assistido por IA**, principalmente através do **OpenCode**, e faço questão de ser transparente sobre isso. O Asher é um projeto solo, e a IA participa de boa parte do trabalho: escrever e refatorar código C#, investigar o comportamento do jogo, trabalhar em partes desconhecidas do código, testar ideias, depurar problemas e escrever documentação.

Isso não significa que o projeto seja gerado a partir de um único prompt ou que toda mudança siga o mesmo processo. Às vezes o OpenCode escreve uma parte maior do código que eu reviso e modifico. Costumo usar a IA para investigar um problema e estruturar o núcleo de uma nova funcionalidade antes de escrever a implementação por conta própria. Isso também inclui explorar novas ferramentas e tecnologias que descubro durante o desenvolvimento do projeto.

## Por que usar IA?

O Asher cobre bastante coisa para um projeto solo: C# e diferentes runtimes do .NET, patching com Harmony, engenharia reversa e investigação de um jogo fechado, XNA/Mono/FNA, Windows e Linux, empacotamento e documentação. A IA torna esse trabalho mais **prático**. Ela é especialmente útil ao explorar outros projetos, inspecionar uma assembly, executar testes ou investigar uma tecnologia desconhecida e usar o que aprendi para decidir o que manter. Ela simplesmente torna muito mais curto o ciclo entre investigar um problema e tentar uma solução eficaz.

## A IA toma as decisões do projeto? Em outras palavras, este projeto foi feito só no "vibe coding" mal feito?

**Não**. O OpenCode sugere diferentes abordagens, explica problemas ou implementa mudanças, mas seu resultado nem sempre é considerado a solução mais adequada. Frequentemente escolho a abordagem mais simples ou clara e decido o que pertence ao Asher e o que deve ser mantido, alterado ou removido. Quando algo afeta o jogo, isso é verificado em relação ao comportamento real do Dust. Este projeto não é apenas um ambiente para experimentação, mas uma oportunidade para encontrar novas ferramentas e ampliar as possibilidades de modding do Dust. Isso explica as constantes transições entre tecnologias relacionadas à interface e abordagens multiplataforma.

O que começou como um simples gerenciador de mods com interface gráfica para os patches do [DustAetPatchingPlatform](https://github.com/GMMan/DustAetPatchingPlatform) acabou se tornando uma nova plataforma para usuários e desenvolvedores.

## Existem desvantagens em usar IA?

**Sim**. A IA pode complicar demais uma mudança simples, introduzir abstrações que não são realmente necessárias, duplicar documentação ou fazer alterações importantes que acabam se mostrando incorretas. O código gerado também pode funcionar corretamente e, ainda assim, ser mais difícil de entender ou manter do que deveria. Usar IA significa dedicar tempo para verificar o que ela produz, simplificar as coisas quando necessário e garantir que o projeto continue fazendo sentido como um todo.

O objetivo não é fazer a IA escrever o máximo de código possível; é usá-la para tornar um projeto solo difícil mais viável, mantendo a arquitetura e a direção sob controle humano.

---

[[🐱 Asher\|< Voltar]]

:::