---
{"dg-publish":true,"permalink":"/portfolio/asher/","title":{"pt":"🛠️ Asher","en":"🛠️ Asher"},"dg-note-properties":{"dgShowComments":false,"isPortfolioViewableOnly":true,"title":{"pt":"🛠️ Asher","en":"🛠️ Asher"}}}
---

:::lang pt

# 🛠️ Asher

## Plataforma de modding para Dust: An Elysian Tail

**Asher** é uma plataforma de modding baseada em launcher para [_Dust: An Elysian Tail_](https://store.steampowered.com/app/236090/Dust_An_Elysian_Tail/), desenvolvida com o objetivo de fornecer uma infraestrutura modular para criação, instalação e execução de modificações.

O projeto combina **patching de código em runtime** e **substituição de conteúdo**, buscando oferecer uma experiência de modding segura, modular e reversível.

[Repositório](https://github.com/MikeMequis/Asher)

> Documentação técnica detalhada: [Asher (Jardim)](https://chatgpt.com/g/g-p-6a42dcae811c81918f6cc388d7999777-digital-garden-setup/c/%F0%9F%90%B1%20Asher)

## 🎯 Objetivo

O Asher surgiu da necessidade de criar uma infraestrutura de modding mais organizada para _Dust: An Elysian Tail_, em vez de depender de alterações manuais diretamente nos arquivos do jogo.

A proposta é fornecer uma camada intermediária entre o jogo e os mods, permitindo que diferentes modificações possam ser instaladas e gerenciadas de maneira independente.

O projeto foi inspirado em soluções consolidadas do ecossistema de modding, especialmente **SMAPI**, **SMAPI Content Patcher** e outras plataformas de patching utilizadas como referência arquitetural.

## 🧩 Arquitetura

A arquitetura do Asher é dividida em componentes com responsabilidades distintas, separando o gerenciamento dos mods da execução das modificações dentro do jogo.

### Launcher / Manager

O componente responsável pelo gerenciamento da instalação e execução dos mods.

Entre suas responsabilidades estão:

- gerenciamento do ambiente de modding;
    
- organização dos mods instalados;
    
- preparação da execução;
    
- interação com os componentes de runtime;
    
- gerenciamento do processo de inicialização do jogo.
    

A separação entre gerenciamento e execução permite que o sistema de modding evolua sem concentrar toda a lógica em um único componente.

### Runtime

O **Asher Runtime** atua durante a execução do jogo, fornecendo a infraestrutura necessária para aplicar modificações em tempo de execução.

O projeto utiliza **Harmony** como parte de sua infraestrutura de patching, permitindo modificar o comportamento do código existente sem alterar permanentemente os assemblies originais.

Essa abordagem torna as alterações mais controláveis e reversíveis, além de permitir que diferentes mods sejam aplicados sobre o mesmo ambiente.

### Content Replacement

Além de alterações comportamentais através de código, o Asher também contempla a **substituição de conteúdo**.

Essa separação permite trabalhar com dois tipos diferentes de modificação:

- alterações na lógica e comportamento do jogo;
    
- substituição ou modificação de recursos utilizados pelo jogo.
    

A abordagem aproxima a arquitetura do conceito de um **framework de modding**, em vez de simplesmente fornecer um conjunto de hacks específicos para o jogo.

## 🔧 Tecnologias

O projeto utiliza principalmente o ecossistema **.NET/C#**, com componentes específicos para gerenciamento, runtime e patching.

Entre as principais tecnologias e referências utilizadas estão:

- **C#**
    
- **.NET**
    
- **WPF**
    
- **Prism**
    
- **Harmony**
    
- **Git**
    
- **Dust: An Elysian Tail**
    
- **SMAPI**
    
- **SMAPI Content Patcher**
    
- **DustAetPatchingPlatform**
    

A utilização de uma arquitetura baseada em componentes permite manter responsabilidades separadas e facilita a evolução incremental da plataforma.

## 🧠 Principais desafios técnicos

O desenvolvimento do Asher envolve problemas diferentes daqueles encontrados no desenvolvimento de uma aplicação convencional.

Entre os principais desafios estão:

- modificar o comportamento de uma aplicação existente sem possuir controle sobre seu código-fonte;
    
- aplicar patches durante a execução do jogo;
    
- manter as alterações reversíveis;
    
- coordenar componentes executados em diferentes momentos do ciclo de vida da aplicação;
    
- estabelecer uma arquitetura extensível para diferentes tipos de mods;
    
- gerenciar instalação, execução e distribuição de modificações;
    
- manter a infraestrutura de modding separada da lógica específica de cada mod.
    

Esses requisitos tornam o projeto particularmente interessante como estudo de **engenharia reversa, extensibilidade de software e arquitetura de sistemas sobre aplicações existentes**.

## 📦 Distribuição e ciclo de execução

O Asher utiliza um fluxo baseado em launcher para controlar o ambiente de modding.

De forma simplificada:

**Launcher → preparação do ambiente → inicialização do Runtime → execução do jogo → aplicação dos mods**

Essa estrutura permite centralizar operações que normalmente seriam realizadas manualmente pelo usuário e cria uma base para futuras funcionalidades de gerenciamento e distribuição.

## 🚧 Estado do projeto

O Asher permanece em desenvolvimento.

A implementação atual estabelece a base da plataforma e seus principais componentes, enquanto funcionalidades adicionais continuam sendo planejadas e refinadas.

O roadmap contempla a evolução de:

- gerenciamento de mods;
    
- infraestrutura de runtime;
    
- instalação e distribuição;
    
- suporte a diferentes tipos de modificações;
    
- ferramentas para desenvolvimento de mods;
    
- documentação e experiência de utilização.
    

A documentação detalhada do Garden acompanha a evolução técnica do projeto, incluindo sua arquitetura, componentes, funcionalidades, processo de build e releases.

## 📌 Competências demonstradas

O desenvolvimento do Asher envolve competências em:

- **C# e .NET**
    
- Arquitetura de software modular
    
- Desenvolvimento de aplicações desktop
    
- WPF e Prism
    
- Runtime patching
    
- Harmony
    
- Engenharia reversa
    
- Modding de jogos
    
- Gerenciamento de processos
    
- Integração entre componentes
    
- Desenvolvimento orientado à extensibilidade
    
- Git e distribuição de software
    

Mais do que um projeto de modificação de jogo, o Asher representa um estudo prático de como **construir uma camada de extensibilidade sobre uma aplicação existente**, conciliando limitações impostas pelo software original com uma arquitetura própria para instalação, execução e gerenciamento de modificações.

:::

:::lang en

# 🛠️ Asher

## Modding platform for Dust: An Elysian Tail

**Asher** is a launcher-based modding platform for [_Dust: An Elysian Tail_](https://store.steampowered.com/app/236090/Dust_An_Elysian_Tail/), designed to provide a modular infrastructure for creating, installing, and running modifications.

The project combines **runtime code patching** and **content replacement**, aiming to provide a safe, modular, and reversible modding experience.

[Repository](https://github.com/MikeMequis/Asher)

> Detailed technical documentation: [Asher (Garden)](https://chatgpt.com/g/g-p-6a42dcae811c81918f6cc388d7999777-digital-garden-setup/c/%F0%9F%90%B1%20Asher)

## 🎯 Objective

Asher was created to provide a more structured modding infrastructure for _Dust: An Elysian Tail_, avoiding the need for manual modifications directly to the game's files.

The platform introduces an intermediate layer between the game and its mods, allowing different modifications to be installed and managed independently.

The project takes inspiration from established modding solutions, particularly **SMAPI**, **SMAPI Content Patcher**, and other patching platforms used as architectural references.

## 🧩 Architecture

Asher is divided into components with distinct responsibilities, separating mod management from modification execution inside the game.

### Launcher / Manager

The component responsible for managing the modding environment and launching the game.

Its responsibilities include:

- modding environment management;
    
- organization of installed mods;
    
- execution preparation;
    
- interaction with runtime components;
    
- game process startup management.
    

Separating management from execution allows the modding system to evolve without concentrating all functionality within a single component.

### Runtime

The **Asher Runtime** operates while the game is running, providing the infrastructure required to apply modifications at runtime.

The project uses **Harmony** as part of its patching infrastructure, allowing existing code behavior to be modified without permanently altering the original assemblies.

This approach makes modifications more controlled and reversible while allowing multiple mods to operate within the same environment.

### Content Replacement

In addition to behavioral modifications through code, Asher also supports **content replacement**.

This separation allows the platform to address two different categories of modifications:

- changes to game logic and behavior;
    
- replacement or modification of assets and other game content.
    

This approach brings the project closer to a **modding framework** rather than a collection of game-specific hacks.

## 🔧 Technologies

The project primarily uses the **.NET/C# ecosystem**, with dedicated components for management, runtime execution, and patching.

Key technologies and references include:

- **C#**
    
- **.NET**
    
- **WPF**
    
- **Prism**
    
- **Harmony**
    
- **Git**
    
- **Dust: An Elysian Tail**
    
- **SMAPI**
    
- **SMAPI Content Patcher**
    
- **DustAetPatchingPlatform**
    

The component-based architecture keeps responsibilities separated and enables incremental evolution of the platform.

## 🧠 Key technical challenges

Asher involves challenges that differ significantly from those found in conventional application development.

Key challenges include:

- modifying the behavior of an existing application without access to its source code;
    
- applying patches during runtime;
    
- keeping modifications reversible;
    
- coordinating components operating at different stages of the application's lifecycle;
    
- establishing an extensible architecture for different types of mods;
    
- managing mod installation, execution, and distribution;
    
- keeping the modding infrastructure separate from individual mod logic.
    

These requirements make the project a practical study in **reverse engineering, software extensibility, and system architecture built around an existing application**.

## 📦 Distribution and execution flow

Asher uses a launcher-based workflow to control the modding environment.

At a high level:

**Launcher → environment preparation → Runtime initialization → game execution → mod application**

This structure centralizes operations that would otherwise have to be performed manually and establishes a foundation for future management and distribution features.

## 🚧 Project status

Asher is currently under development.

The current implementation establishes the platform's foundation and its main components, while additional features continue to be planned and refined.

The roadmap includes further development of:

- mod management;
    
- runtime infrastructure;
    
- installation and distribution;
    
- support for different types of modifications;
    
- mod development tooling;
    
- documentation and user experience.
    

The detailed Garden documentation tracks the project's technical evolution, including its architecture, components, features, build process, and releases.

## 📌 Skills demonstrated

Asher involves practical experience with:

- **C# and .NET**
    
- Modular software architecture
    
- Desktop application development
    
- WPF and Prism
    
- Runtime patching
    
- Harmony
    
- Reverse engineering
    
- Game modding
    
- Process management
    
- Component integration
    
- Extensibility-oriented development
    
- Git and software distribution
    

Rather than being simply a game modification project, Asher represents a practical study of how to **build an extensibility layer around an existing application**, balancing constraints imposed by the original software with a custom architecture for installing, executing, and managing modifications.

:::