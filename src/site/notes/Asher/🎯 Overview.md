---
{"dg-publish":true,"permalink":"/asher/overview/","dg-note-properties":{"dgShowComments":false}}
---

**Asher** is a launcher-based modding platform for *Dust: An Elysian Tail*, designed to support **runtime code patching** and **content replacement** in a safe, modular, and reversible way.

Inspired by mature mod loaders such as **SMAPI**, Asher prioritizes **explicit initialization order**, **runtime lifecycle control**, and **clean debugging**, deliberately avoiding fragile early-injection patterns.

## Project Goals

- Runtime code patching using **Harmony**
- Asset replacement without modifying `.xnb` files
- Modular and reversible mod loading
- UI-based patch selection and configuration
- Full compatibility with **Steam**, **XNA**, and **.NET Framework**

## Project Principles (Non-Negotiable)

- 🚫 No `.xnb` editing
- 🚫 No permanent binary modification
- ✅ 100% runtime patching
- ✅ Fully reversible (remove mod = original behavior)
- ✅ Modular and extensible
- ✅ Inspired by SMAPI, adapted to Dust
- ✅ Clean separation: Launcher → Runtime → SDK → Mods
- ✅ Comprehensive logging for debugging

---
*Last Updated: July 2, 2026*
[[🧱 Asher\|< Voltar]]
