# Nevin Lab: Systems Security Research Dossier

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

This repository hosts the source code and documentation for the **Nevin Lab Systems Security Dossier**. It bridges the semantic gap between compile-time intent and runtime enforcement through a unified, kernel-native defense quadrant.

## The Research Quadrant

The dossier documents four distinct enforcement boundaries developed between 2025 and 2026:

1.  **Sentinel-CC (Build Time):** LLVM-based Policy-Carrying Code. Recently updated to **Phase 2**, featuring Deep CFI (Call-Stack Validation) and ASLR-aware enforcement.
2.  **Sentinel Runtime (Host):** An eBPF-LSM active defense engine (M8.2 Citadel) featuring recursive "bloodline" process tracking.
3.  **Hyperion XDP (Network):** A wire-speed network containment satellite achieving ~65 Gbps throughput with zero-copy telemetry.
4.  **Telos (AI Agent):** A teleological runtime preventing Indirect Prompt Injection (IPI) via kernel-level intent verification.

## Project Structure

This project is built with **Astro Starlight** and utilizes a research-first directory structure:

```text
.
├── src/content/docs/
│   ├── architecture/   # System design & Unified Defense Graph
│   ├── engineering/    # Implementation details (LLVM, eBPF, XDP)
│   ├── evidence/       # Performance benchmarks & Threat models
│   └── log/            # Lab Notes & Research Journal (Feb 2026 Sprint)
├── astro.config.mjs    # Configured with /research-dossier base path
└── .github/workflows/  # Automated deployment to GitHub Pages

```

## Genie Commands

| Command | Action |
| --- | --- |
| `npm install` | Installs research portal dependencies |
| `npm run dev` | Starts local research environment |
| `npm run build` | Compiles the dossier for production |
| `npm run preview` | Previews the built dossier locally |

## Current Research Focus (Feb 14-15 Sprint)

The latest engineering logs document the completion of **Sentinel-CC Phase 2**. This milestone successfully implemented eBPF stack-walking to neutralize Return-Oriented Programming (ROP) attacks by validating syscall callers against compiler-generated metadata.

---

**Nevin Shine** // Systems Security Research