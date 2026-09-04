---
{"dg-publish":true,"permalink":"/asher/build-and-distribution/","title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"}}}
---

:::lang en
## Requirements

- Visual Studio 2022 / `dotnet` CLI
- Node.js 18+ (for Electron manager)
- Platform: **x86**
- Configuration: **Release** (for distribution)
- **Microsoft XNA Framework 4.0** (GAC) — required by `Asher.Runtime` and patching projects

### XNA Framework

Without XNA 4.0 assemblies, `npm run build:host` / patching builds fail or warn about missing `Microsoft.Xna.Framework*`.

1. Install [XNA Framework Redistributable 4.0](https://www.microsoft.com/en-us/download/details.aspx?id=20914) (or the [4.0 Refresh](https://www.microsoft.com/en-us/download/details.aspx?id=27598))
2. Prefer the **x86** redistributable — Asher targets `Platform=x86`
3. Rebuild: `cd Asher.Electron && npm run build:host:debug`

Steam installs of Dust often already place these assemblies on the machine.

## Build the backend (Host + runtime + patches)

From `Asher.Electron/`:

```bash
npm install
npm run build:host          # Release (for dist)
npm run build:host:debug    # Debug (for local UI work)
```

This builds `Asher.SDK`, all `Asher.Patching.*` projects, `Asher.Runtime`, `Asher.Launcher`, and `Asher.Host` (with `install-payload/` staged next to the host binary).

Alternatively, from the repo root:

```cmd
Asher.Host\build-with-payload.cmd Release
```

## Run the manager in development

```bash
cd Asher.Electron
npm start
```

## Package Distribution (zip + folder)

```bash
cd Asher.Electron
npm run dist       # builds zip + syncs repo-root Distribution/
npm run publish    # publishes GitHub Release (requires private/GH_TOKEN)
```

Users extract the zip (or use `Distribution/`), run `Asher.exe`, then install into the game folder. The manager stays in Distribution. The game folder gets runtime files plus `Uninstall-Asher.cmd` beside `DustAET.exe` for emergency restore.

Publish requires a GitHub token at repo-root `private/GH_TOKEN` (gitignored). Packaged builds can check/apply GitHub release zips from Settings; unpackaged `npm start` cannot.

> Portable-as-primary packaging was retired. Ship path is **zip + `Distribution/`**.

## Distribution notes

- `0Harmony.dll` must be the **net472** build — wrong Harmony versions cause `System.Runtime` errors at game launch
- `install-payload/DefaultMods/` must include all five default patch DLLs
- Launch the game via **Steam** or the manager's **Launch Game** button — not by running `Asher.Launcher.exe` from the build output directly
- On Windows, `npm run dist` may need Developer Mode or an elevated terminal if electron-builder's `winCodeSign` cache requires symlink privilege

---
[[🐱 Asher\|< Back]]

:::

:::lang pt
## Requisitos

- Visual Studio 2022 / CLI do `dotnet`
- Node.js 18+ (para o gerenciador Electron)
- Plataforma: **x86**
- Configuração: **Release** (para distribuição)
- **Microsoft XNA Framework 4.0** (GAC) — exigido por `Asher.Runtime` e projetos de patching

### XNA Framework

Sem os assemblies do XNA 4.0, `npm run build:host` / builds de patching falham ou avisam sobre `Microsoft.Xna.Framework*` ausente.

1. Instale o [Redistributable do XNA Framework 4.0](https://www.microsoft.com/en-us/download/details.aspx?id=20914) (ou o [4.0 Refresh](https://www.microsoft.com/en-us/download/details.aspx?id=27598))
2. Prefira o redistributable **x86** — o Asher usa `Platform=x86`
3. Recompile: `cd Asher.Electron && npm run build:host:debug`

Instalações Steam do Dust costumam já trazer esses assemblies.

## Compilar o backend (Host + runtime + patches)

A partir de `Asher.Electron/`:

```bash
npm install
npm run build:host
npm run build:host:debug
```

Isso compila `Asher.SDK`, todos os projetos `Asher.Patching.*`, `Asher.Runtime`, `Asher.Launcher` e `Asher.Host` (com `install-payload/` ao lado do binário do host).

Alternativamente, na raiz do repositório:

```cmd
Asher.Host\build-with-payload.cmd Release
```

## Executar o gerenciador em desenvolvimento

```bash
cd Asher.Electron
npm start
```

## Empacotar Distribution (zip + pasta)

```bash
cd Asher.Electron
npm run dist       # gera zip + sincroniza Distribution/ na raiz
npm run publish    # publica GitHub Release (requer private/GH_TOKEN)
```

O usuário extrai o zip (ou usa `Distribution/`), roda `Asher.exe` e instala na pasta do jogo. O gerenciador fica em Distribution. A pasta do jogo recebe runtime + `Uninstall-Asher.cmd` ao lado de `DustAET.exe` para restauração de emergência.

Publish exige token em `private/GH_TOKEN` (gitignored). Builds empacotadas podem checar/aplicar zips do GitHub Releases nas Settings; `npm start` unpackaged não.

> Empacotamento portable-como-primário foi descontinuado. O caminho de ship é **zip + `Distribution/`**.

## Notas de distribuição

- `0Harmony.dll` deve ser a build **net472** — versões erradas do Harmony causam erros de `System.Runtime` na inicialização do jogo
- `install-payload/DefaultMods/` deve incluir os cinco DLLs de patch padrão
- Inicie o jogo pela **Steam** ou pelo botão **Launch Game** do gerenciador — não execute `Asher.Launcher.exe` diretamente da saída de build
- No Windows, `npm run dist` pode precisar de Developer Mode ou terminal elevado se o cache `winCodeSign` do electron-builder exigir privilégio de symlink

---
[[🐱 Asher\|< Voltar]]

:::
