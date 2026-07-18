---
{"dg-publish":true,"permalink":"/asher/build-and-distribution/","dg-note-properties":{"dgShowComments":false}}
---

## Requirements

- Visual Studio 2022 (or `dotnet` CLI)
- **Platform: x86**
- **Configuration: Release** (for distribution)

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
[[🧱 Asher\|< Voltar]]
