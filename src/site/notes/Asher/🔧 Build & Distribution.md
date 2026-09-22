---
{"dg-publish":true,"permalink":"/asher/build-and-distribution/","title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"}}}
---

:::lang en
## Requirements

- Visual Studio 2022 / `dotnet` CLI
- Node.js 18+ (22 recommended) for the Electron manager
- Platform: **x86** on Windows; **x64/AnyCPU** on Linux
- Configuration: **Release** (for distribution)
- **Microsoft XNA Framework 4.0** (GAC) on Windows — required by `Asher.Runtime` and patching projects (Linux uses **FNA**)

### XNA Framework

Without XNA 4.0 assemblies, `npm run build:host` / patching builds fail or warn about missing `Microsoft.Xna.Framework*`.

1. Install [XNA Framework Redistributable 4.0](https://www.microsoft.com/en-us/download/details.aspx?id=20914) (or the [4.0 Refresh](https://www.microsoft.com/en-us/download/details.aspx?id=27598))
2. Prefer the **x86** redistributable — Asher targets `Platform=x86`
3. Rebuild: `cd Asher.Electron && npm run build:host:debug`

Steam installs of Dust often already place these assemblies on the machine.

The references resolve from the GAC via `$(WINDIR)\Microsoft.NET\assembly\GAC_32\...` HintPaths so `dotnet build` finds them, and `npm run build:host` skips optional patches (for example GraphicsDeprofiler) instead of failing when XNA is absent.

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

## Package Distribution (installer + zip + folder)

```bash
cd Asher.Electron
npm run dist       # NSIS installer + portable zip + latest.yml + syncs repo-root Distribution/
npm run publish    # publishes GitHub Release (installer, zip, update metadata) — requires private/GH_TOKEN
```

Outputs in `Asher.Electron/dist/`: `Asher-Setup-<version>.exe` (NSIS installer), `Asher-<version>-win32.zip` (portable), `latest.yml` (update metadata), plus the unpacked `Distribution/` folder. Users run the installer or extract the zip and run `Asher.exe`, then install into the game folder. The game folder gets runtime files plus `Uninstall-Asher.cmd` beside `DustAET.exe` for emergency restore.

Publish requires a GitHub token at repo-root `private/GH_TOKEN` (gitignored). Packaged builds can check/apply GitHub release zips from Settings; unpackaged `npm start` cannot.

## Linux build & distribution (x64)

Run on a Linux host (AppImage cannot be produced from Windows):

```bash
cd Asher.Electron
npm run dist:linux           # Host + Asher.Linux + payload + AppImage/tar.gz + latest-linux.yml
npm run publish:linux        # same, plus uploads assets/metadata (requires private/GH_TOKEN)
```

Artifacts in `Asher.Electron/dist/`: `Asher-<version>-linux-x86_64.AppImage`, `Asher-<version>-linux-x64.tar.gz`, and `latest-linux.yml` (manager binary `Asher`). Prerequisites: .NET SDK 8, Node.js + npm, `gcc`, a Roslyn C# 9 compiler, and the Electron system libraries — full install commands in `docs/Cross-Platform-Architecture.md` → *Linux dependencies*.

Linux uses **Mono/FNA** instead of XNA (the GAC requirement above is Windows-only). Linux updates are manual GitHub release downloads.

## Distribution notes

- `0Harmony.dll` must be the **net472** build — wrong Harmony versions cause `System.Runtime` errors at game launch
- `install-payload/DefaultMods/` must include all five default patch DLLs
- Launch the game via **Steam** or the manager's **Launch Game** button — not by running `Asher.Launcher.exe` from the build output directly
- On Windows, `npm run dist` may need Developer Mode or an elevated terminal if electron-builder's `winCodeSign` cache requires symlink privilege
- `latest.yml` (Windows, NSIS) and `latest-linux.yml` (Linux, AppImage) are the update metadata published with each release

---

[[🐱 Asher\|< Back]]
:::

:::lang pt
## Requisitos

- Visual Studio 2022 / CLI do `dotnet`
- Node.js 18+ (22 recomendado) para o gerenciador Electron
- Plataforma: **x86** no Windows; **x64/AnyCPU** no Linux
- Configuração: **Release** (para distribuição)
- **Microsoft XNA Framework 4.0** (GAC) no Windows — exigido por `Asher.Runtime` e projetos de patching (Linux usa **FNA**)

### XNA Framework

Sem os assemblies do XNA 4.0, `npm run build:host` / builds de patching falham ou avisam sobre `Microsoft.Xna.Framework*` ausente.

1. Instale o [Redistributable do XNA Framework 4.0](https://www.microsoft.com/en-us/download/details.aspx?id=20914) (ou o [4.0 Refresh](https://www.microsoft.com/en-us/download/details.aspx?id=27598))
2. Prefira o redistributable **x86** — o Asher usa `Platform=x86`
3. Recompile: `cd Asher.Electron && npm run build:host:debug`

Instalações Steam do Dust costumam já trazer esses assemblies.

As referências resolvem a partir do GAC via HintPaths `$(WINDIR)\Microsoft.NET\assembly\GAC_32\...`, então o `dotnet build` as encontra; `npm run build:host` pula patches opcionais (por exemplo GraphicsDeprofiler) em vez de falhar quando o XNA está ausente.

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

## Empacotar Distribution (instalador + zip + pasta)

```bash
cd Asher.Electron
npm run dist       # instalador NSIS + zip portátil + latest.yml + sincroniza Distribution/ na raiz
npm run publish    # publica GitHub Release (instalador, zip, metadados de update) — requer private/GH_TOKEN
```

Saídas em `Asher.Electron/dist/`: `Asher-Setup-<version>.exe` (instalador NSIS), `Asher-<version>-win32.zip` (portátil), `latest.yml` (metadados de update) e a pasta `Distribution/` descompactada. O usuário roda o instalador ou extrai o zip e roda `Asher.exe`, depois instala na pasta do jogo. A pasta do jogo recebe runtime + `Uninstall-Asher.cmd` ao lado de `DustAET.exe` para restauração de emergência.

Publish exige token em `private/GH_TOKEN` (gitignored). Builds empacotadas podem checar/aplicar zips do GitHub Releases nas Settings; `npm start` unpackaged não.

## Build & distribuição Linux (x64)

Rode em um host Linux (o AppImage não pode ser gerado a partir do Windows):

```bash
cd Asher.Electron
npm run dist:linux           # Host + Asher.Linux + payload + AppImage/tar.gz + latest-linux.yml
npm run publish:linux        # o mesmo, mais upload de assets/metadados (requer private/GH_TOKEN)
```

Artefatos em `Asher.Electron/dist/`: `Asher-<version>-linux-x86_64.AppImage`, `Asher-<version>-linux-x64.tar.gz` e `latest-linux.yml` (binário do gerenciador `Asher`). Pré-requisitos: .NET SDK 8, Node.js + npm, `gcc`, um compilador Roslyn C# 9 e as bibliotecas de sistema do Electron — comandos completos em `docs/Cross-Platform-Architecture.md` → *Linux dependencies*.

No Linux usa-se **Mono/FNA** em vez de XNA (o requisito de GAC acima é só do Windows). Atualizações no Linux são downloads manuais do GitHub Releases.

## Notas de distribuição

- `0Harmony.dll` deve ser a build **net472** — versões erradas do Harmony causam erros de `System.Runtime` na inicialização do jogo
- `install-payload/DefaultMods/` deve incluir os cinco DLLs de patch padrão
- Inicie o jogo pela **Steam** ou pelo botão **Launch Game** do gerenciador — não execute `Asher.Launcher.exe` diretamente da saída de build
- No Windows, `npm run dist` pode precisar de Developer Mode ou terminal elevado se o cache `winCodeSign` do electron-builder exigir privilégio de symlink
- `latest.yml` (Windows, NSIS) e `latest-linux.yml` (Linux, AppImage) são os metadados de update publicados em cada release

---

[[🐱 Asher\|< Voltar]]
:::
