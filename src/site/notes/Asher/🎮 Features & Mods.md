---
{"dg-publish":true,"permalink":"/asher/features-and-mods/","title":{"pt":"🎮 Funcionalidades & Modificações","en":"🎮 Features & Mods"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🎮 Funcionalidades & Modificações","en":"🎮 Features & Mods"}}}
---

:::lang en
## Working Features

### Runtime & Modding
- ✅ Dynamic mod loading from `Asher/Mods/`
- ✅ Three-stage mod lifecycle: PreInit → Patch → Lifecycle
- ✅ Clean SDK for mod developers (`AsherModAttribute` / metadata helpers)
- ✅ Logging in `Asher/AsherLogs/` (`runtime_*.log`, `manager_*.log`, `launcher_fatal_*.log`)

### Manager App (Electron)
- ✅ Guided installation into any valid Dust game folder
- ✅ Install always creates a game backup (`Asher.Backup`)
- ✅ Uninstall and reinstall in a single session
- ✅ **Safe uninstallation** (in-app) vs **Total exclusion** (`Uninstall-Asher.cmd`)
- ✅ Emergency restore helper beside `DustAET.exe` if Distribution is missing
- ✅ Patch Manager — toggle mods on/off without deleting files
- ✅ Launch game from manager / Finish screen
- ✅ Localization (en-US, pt-BR, es) and Light/Dark theme
- ✅ Toast notifications; settings auto-save; preference-only reset
- ✅ Zip + `Distribution/` packaging; GitHub Releases update check/apply
- ✅ Manager UI stays in Distribution (not deployed into the game folder)

### Working Mods
* ✅ **Debug Menu Enabler** — `Tab` in pause menu opens debug menu
* ✅ **Intro Skipper** — Skips ESRB, splash screens, intro video; lands on "Press A" with menu music
* ✅ **Graphics Deprofiler** — Bypasses HiDef GPU profile restrictions
* ✅ **Mute Voice Acting** — Mutes voice acting while keeping other SFX
* ✅ **Dust Storm Overheat Disabler** — Prevents Dust Storm from overheating

All implemented as external, runtime-loaded mods in `Asher/Mods/`.

---
[[🐱 Asher\|< Back]]

:::

:::lang pt

## Implementações Funcionais

### Runtime & Modding
- ✅ Carregamento dinâmico de mods a partir de `Asher/Mods/`
- ✅ Ciclo de vida de mod em três estágios: PreInit → Patch → Lifecycle
- ✅ SDK limpo para desenvolvedores de mods (`AsherModAttribute` / metadados)
- ✅ Logs em `Asher/AsherLogs/` (`runtime_*.log`, `manager_*.log`, `launcher_fatal_*.log`)

### App Gerenciador (Electron)
- ✅ Instalação guiada em qualquer pasta do jogo válida
- ✅ Instalação sempre cria backup (`Asher.Backup`)
- ✅ Desinstalar e reinstalar na mesma sessão
- ✅ **Desinstalação segura** (in-app) vs **Exclusão total** (`Uninstall-Asher.cmd`)
- ✅ Helper de restauração de emergência ao lado de `DustAET.exe` se Distribution faltar
- ✅ Patch Manager — ativa/desativa mods sem excluir arquivos
- ✅ Inicia o jogo pelo gerenciador / tela Finish
- ✅ Localização (en-US, pt-BR, es) e tema Light/Dark
- ✅ Toasts; auto-save de settings; reset só de preferências
- ✅ Empacotamento zip + `Distribution/`; check/apply de updates via GitHub Releases
- ✅ UI do gerenciador fica em Distribution (não implantada na pasta do jogo)

### Mods Funcionais
- ✅ **Debug Menu Enabler** — `Tab` no menu de pausa abre o menu de depuração
- ✅ **Intro Skipper** — Pula ESRB, splash e vídeo de intro; chega na tela "Press A" com música do menu
- ✅ **Graphics Deprofiler** — Contorna restrições de perfil de GPU HiDef
- ✅ **Mute Voice Acting** — Silencia dublagem mantendo outros SFX
- ✅ **Dust Storm Overheat Disabler** — Impede o Dust Storm de superaquecer

Todos implementados como mods externos, carregados em tempo de execução, em `Asher/Mods/`.

---
[[🐱 Asher\|< Voltar]]

:::
