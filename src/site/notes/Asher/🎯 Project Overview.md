---
{"dg-publish":true,"permalink":"/asher/project-overview/","title":{"pt":"🎯 Visão Geral do Projeto","en":"🎯 Project Overview"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🎯 Visão Geral do Projeto","en":"🎯 Project Overview"}}}
---

:::lang en

Inspired by mature mod loaders such as **SMAPI**, Asher prioritizes **explicit initialization order**, **runtime lifecycle control**, and **clean debugging**, deliberately avoiding fragile early-injection patterns.

## Project Goals

- Runtime code patching using **Harmony**
- Asset replacement without modifying `.xnb` files
- Modular and reversible mod loading
- UI-based patch selection and configuration
- Full compatibility with **Steam**; **XNA** / **.NET Framework** on Windows, **Mono** / **FNA** on Linux

## Project Principles

- 🚫 No `.xnb` editing
- 🚫 No permanent binary modification
- ✅ 100% runtime patching
- ✅ Fully reversible (remove mod → original behavior)
- ✅ Modular and extensible
- ✅ Clean separation: Electron manager → Host → platform abstraction → Launcher / bootstrap → Runtime → SDK → Mods
- ✅ Windows and Linux (launcher swap on Windows; `LD_PRELOAD` bootstrap on Linux)
- ✅ Comprehensive logging for debugging

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

Inspirado em mod loaders maduros como o **SMAPI**, o Asher prioriza uma **ordem de inicialização explícita**, **controle do ciclo de vida** em tempo de execução e **depuração limpa**, evitando deliberadamente padrões frágeis de injeção precoce. 

# Objetivos do Projeto

- Aplicação de patches de código em tempo de execução com **Harmony**
- Substituição de assets sem modificar arquivos `.xnb`
- Carregamento de mods modular e reversível
- Seleção e configuração de patches via interface gráfica
- Compatibilidade total com **Steam**; **XNA** / **.NET Framework** no Windows, **Mono** / **FNA** no Linux

# Princípios do Projeto

- 🚫 Sem edição de `.xnb`
- 🚫 Sem modificação binária permanente
- ✅ 100% patching em tempo de execução
- ✅ Totalmente reversível (remover o mod → comportamento original)
- ✅ Modular e extensível
- ✅ Separação clara: gerenciador Electron → Host → abstração de plataforma → Launcher / bootstrap → Runtime → SDK → Mods
- ✅ Windows e Linux (troca de launcher no Windows; bootstrap via `LD_PRELOAD` no Linux)
- ✅ Registro de logs abrangente para depuração

---
[[🐱 Asher\|< Voltar]]

:::