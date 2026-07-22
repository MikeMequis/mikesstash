---
{"dg-publish":true,"permalink":"/asher/manager-app/","title":{"pt":"🖥️ Aplicação Gerenciadora","en":"🖥️ Manager App"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🖥️ Aplicação Gerenciadora","en":"🖥️ Manager App"}}}
---

:::lang en

`Asher.App` is a WPF application built with **Prism**, **Material Design**, and a modular service layer.

## Installation mode

When Asher is not yet installed in a game folder, the app opens in **installation mode** and starts on the **Start** page:

1. **Start** — welcome and begin installation
2. **Detect Game** — auto-detect or browse for the Dust folder
3. **Installing** — deploy runtime, launcher wrapper, and default mods
4. **Complete** — summary with optional **desktop shortcut** creation

On finish, the app switches to mod manager mode and navigates to **Home**. If the installer was run from `Distribution\`, the distribution app closes and the installed copy at `[Game]\Asher\Asher.App\Asher.App.exe` is launched automatically.

## Mod manager mode

When Asher is already installed (detected from settings or from running inside `[Game]\Asher\Asher.App\`), the app opens in *Manager mode* and starts on **Home**:

| Page                | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| **Home**            | Quick actions — launch game, open Patch Manager, Settings               |
| **Content Patcher** | Asset replacement UI                                                    |
| **Patch Manager**   | Enable/disable mods by moving DLLs between `Mods/` and `Mods/disabled/` |
| **Settings**        | Game path, language, theme, backups, auto-launch                        |

## App features

- **Localization** — English and Portuguese (Brazil); language changes refresh labels dynamically
- **Light / Dark theme** — full-window Material Design theming via Settings
- **Settings persistence** — `settings.json` in AppData, game manager folder, and local app directory
- **Game launch** — launches `DustAET.exe` (Asher launcher wrapper) from the detected game folder
- **Desktop shortcut** — optional shortcut to `Asher.App.exe` after installation

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

`Asher.App` é uma aplicação WPF construída com **Prism**, **Material Design** e uma camada de serviços modular.

## Modo de instalação

Quando o Asher ainda não está instalado em uma pasta de jogo, o app abre em **modo de instalação** e inicia na página **Start**:

1. **Start** — boas-vindas e início da instalação
2. **Detect Game** — detecção automática ou navegação manual até a pasta do Dust
3. **Installing** — implantação do runtime, do wrapper do launcher e dos mods padrão
4. **Complete** — resumo com criação opcional de **atalho na área de trabalho** Ao finalizar, o app muda para o modo de gerenciador de mods e navega até **Home**. Se o instalador tiver sido executado a partir de `Distribution\`, o app de distribuição se fecha e a cópia instalada em `[Game]\Asher\Asher.App\Asher.App.exe` é iniciada automaticamente.

## Modo de gerenciador de mods

Quando o Asher já está instalado (detectado pelas configurações ou por estar sendo executado dentro de `[Game]\Asher\Asher.App\`), o app abre no _modo Gerenciador_ e inicia na **Home**:

| Página                     | Descrição                                                            |
| -------------------------- | -------------------------------------------------------------------- |
| **Home**                   | Ações rápidas — iniciar o jogo, abrir o Patch Manager, Configurações |
| **Content Patcher**        | Interface de substituição de assets                                  |
| **Gerenciador de Patches** | Ativa/desativa mods movendo DLLs entre `Mods/` e `Mods/disabled/`    |
| **Configurações**          | Caminho do jogo, idioma, tema, backups, inicialização automática     |

## Recursos do app

- **Localização** — Inglês e Português (Brasil); mudanças de idioma atualizam os textos dinamicamente
- **Tema Claro / Escuro** — tema Material Design de janela inteira via Configurações
- **Persistência de configurações** — `settings.json` no AppData, na pasta do gerenciador do jogo e no diretório local do app
- **Inicialização do jogo** — inicia o `DustAET.exe` (wrapper do launcher Asher) a partir da pasta do jogo detectada
- **Atalho na área de trabalho** — atalho opcional para o `Asher.App.exe` após a instalação

---
[[🐱 Asher\|< Voltar]]

:::