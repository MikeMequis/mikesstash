---
{"dg-publish":true,"permalink":"/asher/manager-app/","dg-note-properties":{"dgShowComments":false}}
---

`Asher.App` is a WPF application built with **Prism**, **Material Design**, and a modular service layer.

## Installation mode

When Asher is not yet installed in a game folder, the app opens in **installation mode** and starts on the **Start** page:

1. **Start** — welcome and begin installation
2. **Detect Game** — auto-detect or browse for the Dust folder
3. **Installing** — deploy runtime, launcher wrapper, and default mods
4. **Complete** — summary with optional **desktop shortcut** creation

On finish, the app switches to mod manager mode and navigates to **Home**. If the installer was run from `Distribution\`, the distribution app closes and the installed copy at `[Game]\Asher\Asher.App\Asher.App.exe` is launched automatically.

## Mod manager mode

When Asher is already installed (detected from settings or from running inside `[Game]\Asher\Asher.App\`), the app opens in **manager mode** and starts on **Home**:

| Page | Description |
|------|-------------|
| **Home** | Quick actions — launch game, open Patch Manager, Settings |
| **Content Patcher** | Asset replacement UI (planned functionality) |
| **Patch Manager** | Enable/disable mods by moving DLLs between `Mods/` and `Mods/disabled/` |
| **Settings** | Game path, language, theme, backups, auto-launch |

## App features

- **Localization** — English and Portuguese (Brazil); language changes refresh labels without resetting the current page
- **Light / Dark theme** — full-window Material Design theming via Settings
- **Settings persistence** — `settings.json` in AppData, game manager folder, and local app directory
- **Game launch** — launches `DustAET.exe` (Asher launcher wrapper) from the detected game folder
- **Desktop shortcut** — optional shortcut to `Asher.App.exe` after installation
- **Legacy layout migration** — automatically moves old root-level `Asher.App`, `Asher.Backup`, and `patches` into `Asher/`

---
[[🧱 Asher\|< Voltar]]
