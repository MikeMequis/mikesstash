---
{"dg-publish":true,"permalink":"/asher/build-and-distribution/","title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"},"dg-note-properties":{"dgShowComments":false,"title":{"pt":"🔧 Build & Distribuição","en":"🔧 Build & Distribution"}}}
---

:::lang en
## Requirements

- Visual Studio 2022 (`dotnet` CLI)
- Platform: **x86**
- Configuration: **Release** (for distribution)

## Steps

1. Build the solution as **x86 Release** in Visual Studio
2. Run the distribution script from the repo root:

```powershell
.\PrepareDistribution.ps1
```

3. Run `Distribution\Asher.App.exe` to install Asher into a game folder
4. After install, use `[GameFolder]\Asher\Asher.App\Asher.App.exe` for day-to-day management
5. Launch the game via **Steam** or the manager's **Launch Game** button

## Distribution notes

- `PrepareDistribution.ps1` explicitly bundles the **net472** `0Harmony.dll` — using the wrong Harmony build will cause `System.Runtime` version errors at launch
- The script copies launcher, runtime, SDK, default mods, and the manager app into `Distribution/`
- `Distribution/` is generated output and should not be committed

---
[[🐱 Asher\|< Back]]

:::

:::lang pt
## Requisitos

- Visual Studio 2022 (CLI do `dotnet`)
- Plataforma: **x86**
- Configuração: **Release** (para distribuição)

## Passos

1. Compile a solução como **x86 Release** no Visual Studio
2. Execute o script de distribuição a partir da raiz da pasta:

```powershell
.\PrepareDistribution.ps1
```

3. Execute `Distribution\Asher.App.exe` para instalar o Asher no local do jogo
4. Após a instalação, use `[GameFolder]\Asher\Asher.App\Asher.App.exe` para o gerenciamento do dia a dia
5. Inicie o jogo pela **Steam** ou pelo botão **Launch Game** da aplicação

## Notas de distribuição

- O `PrepareDistribution.ps1` empacota explicitamente o `0Harmony.dll` da versão **net472** — usar a build errada do Harmony causará erros de versão do `System.Runtime` na inicialização
- O script copia o launcher, o runtime, o SDK, os mods padrão e a aplicação para `Distribution/`
- `Distribution/` é uma saída gerada e não deve ser commitada

---
[[🐱 Asher\|< Voltar]]

:::