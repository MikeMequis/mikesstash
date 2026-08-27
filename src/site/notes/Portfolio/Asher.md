---
{"dg-publish":true,"permalink":"/portfolio/asher/","title":{"pt":"🛠️ Asher","en":"🛠️ Asher"},"dg-note-properties":{"dgShowComments":false,"isPortfolioViewableOnly":true,"navOrder":4,"cardDescription":{"pt":"Plataforma de modding para Dust: An Elysian Tail, desenvolvida para explorar patching de código em runtime e uma infraestrutura modular para criação e gerenciamento de mods.","en":"Modding platform for Dust: An Elysian Tail, built to explore runtime code patching and a modular infrastructure for creating and managing mods."},"title":{"pt":"🛠️ Asher","en":"🛠️ Asher"}}}
---


:::lang pt

# 🛠️ Asher

## Plataforma de modding para Dust: An Elysian Tail

**Asher** é uma plataforma de modding baseada em launcher para [_Dust: An Elysian Tail_](https://store.steampowered.com/app/236090/Dust_An_Elysian_Tail/), desenvolvida com o objetivo de fornecer uma infraestrutura modular para criação, instalação e execução de modificações.

O projeto combina **patching de código em runtime** e **substituição de conteúdo**, buscando oferecer uma experiência de modding segura, modular e reversível.

[Repositório](https://github.com/MikeMequis/Asher)

> Documentação técnica detalhada: [[🐱 Asher\|Asher (Jardim)]]

## 🎯 Objetivo

A proposta é fornecer uma camada intermediária entre o jogo e os mods, permitindo que diferentes modificações possam ser instaladas e gerenciadas de maneira independente.

O projeto foi inspirado em soluções consolidadas do ecossistema de *modding*, especialmente **SMAPI**, **SMAPI Content Patcher** e outras plataformas de *patching* utilizadas como referência arquitetural.

## 🧩 Arquitetura

A arquitetura do Asher é dividida em componentes com responsabilidades distintas, separando o gerenciamento dos *mods* da execução das modificações dentro do jogo.

### Launcher / Manager

O componente responsável pelo gerenciamento da instalação e execução dos *mods*.

Entre suas responsabilidades estão:

- gerenciamento do ambiente de *modding*;
    
- organização dos *mods* instalados;
    
- preparação da execução;
    
- interação com os componentes de *runtime*;
    

### Runtime

O **Asher Runtime** atua durante a execução do jogo, fornecendo a infraestrutura necessária para aplicar modificações em tempo de execução.

O projeto utiliza **Harmony** como parte de sua infraestrutura de *patching*, permitindo modificar o comportamento do código existente sem alterar permanentemente os *assemblies* originais. Essa abordagem torna as alterações mais controláveis e reversíveis, além de permitir que diferentes *mods* sejam aplicados sobre o mesmo ambiente.

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
    

## 🧠 Principais desafios técnicos

O desenvolvimento do Asher envolve problemas diferentes daqueles encontrados no desenvolvimento de uma aplicação convencional.

Entre os principais desafios estão:

- modificar o comportamento de uma aplicação existente sem possuir controle sobre seu código-fonte;
    
- aplicar patches durante a execução do jogo;
    
- manter as alterações reversíveis;
    
- coordenar componentes executados em diferentes momentos do ciclo de vida da aplicação;
    
- estabelecer uma arquitetura extensível para diferentes tipos de mods;
    
- gerenciar instalação, execução e distribuição de modificações;
    

Esses requisitos tornam o projeto particularmente interessante como estudo de **engenharia reversa, extensibilidade de software e arquitetura de sistemas sobre aplicações existentes**.

## 🚧 Estado do projeto

O Asher permanece em desenvolvimento.

A implementação atual estabelece a base da plataforma e seus principais componentes, enquanto funcionalidades adicionais continuam sendo planejadas e refinadas.

O *roadmap* contempla a evolução de:

- gerenciamento de mods;
    
- infraestrutura de runtime;
    
- instalação e distribuição;
    
- suporte a diferentes tipos de modificações;
    
- ferramentas para desenvolvimento de mods;
    
- documentação e experiência de utilização.
    

A documentação detalhada do Jardim acompanha a evolução técnica do projeto, incluindo sua arquitetura, componentes, funcionalidades, processo de build e releases.

[< Voltar](/portfolio/)

:::

:::lang en

# 🛠️ Asher

## Modding platform for Dust: An Elysian Tail

**Asher** is a launcher-based modding platform for [_Dust: An Elysian Tail_](https://store.steampowered.com/app/236090/Dust_An_Elysian_Tail/), designed to provide a modular infrastructure for creating, installing, and running modifications.

The project combines **runtime code patching** and **content replacement**, aiming to provide a safe, modular, and reversible modding experience.

[Repository](https://github.com/MikeMequis/Asher)

> Detailed technical documentation:  [[🐱 Asher\|Asher (Garden)]]

## 🎯 Objective

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
    

### Runtime

The **Asher Runtime** operates while the game is running, providing the infrastructure required to apply modifications at runtime.

The project uses **Harmony** as part of its patching infrastructure, allowing existing code behavior to be modified without permanently altering the original assemblies. This approach makes modifications more controlled and reversible while allowing multiple mods to operate within the same environment.

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
    

## 🧠 Key technical challenges

Asher involves challenges that differ significantly from those found in conventional application development.

Key challenges include:

- modifying the behavior of an existing application without access to its source code;
    
- applying patches during runtime;
    
- keeping modifications reversible;
    
- coordinating components operating at different stages of the application's lifecycle;
    
- establishing an extensible architecture for different types of mods;
    
- managing mod installation, execution, and distribution;
    

These requirements make the project a practical study in **reverse engineering, software extensibility, and system architecture built around an existing application**.

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

[< Back](/portfolio/)

:::