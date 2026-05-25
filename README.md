# Sentinel Stack Research Dossier

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![Deploy to GitHub Pages](https://github.com/nevinshine/research-dossier/actions/workflows/astro.yml/badge.svg)](https://github.com/nevinshine/research-dossier/actions/workflows/astro.yml)

This repository serves as the central knowledge portal for the **Sentinel Stack**, a unified systems security architecture bridging the semantic gap between compile-time intent and runtime enforcement.

Read the full documentation at: **[nevinshine.github.io/research-dossier/](https://nevinshine.github.io/research-dossier/)**

## The Four-Pillar Architecture

The dossier documents four distinct security boundaries enforcing deterministic execution from Ring -1 to Layer 7:

1. **Sentinel-CC (Compile-Time):** Proof-Carrying Code (PCC) and LLVM IR analysis ensuring absolute memory safety and invariant guarantees for legacy C drivers before kernel admission.
2. **Sentinel Runtime (Ring 0):** An eBPF-LSM active defense engine featuring deterministic thread-level policy enforcement and granular resource access controls.
3. **Hyperion XDP (Network Boundary):** A wire-speed network containment satellite achieving O(1) mitigation latency directly at the NIC level.
4. **Telos (AI Agent Security):** A teleological runtime safeguarding autonomous AI agents against Indirect Prompt Injection (IPI) by routing intent through rigorous dual-gate verifiers.

## Automated AST Extraction Pipeline

This repository acts as an aggregator. It does not store the core engineering source code; instead, it uses Git Submodules to pull the execution components and dynamically generates Abstract Syntax Tree (AST) documentation at build time.

The GitHub Actions CI/CD pipeline automatically runs:
- `cargo doc` (for Rust components like `skv-analyzer`)
- `doxygen` + `doxybook2` (for C/eBPF components like `hyperion-xdp` and `sentinel-vmi`)
- `pydoc-markdown` (for Python components like the `telos-runtime` Cortex)

All extracted metadata is converted into Markdown, enriched with Starlight frontmatter, and deployed seamlessly to GitHub Pages.

## Project Structure

```text
.
├── src/content/docs/
│   ├── architecture/   # System design & Unified Defense Graph
│   ├── engineering/    # Implementation deep-dives per pillar
│   ├── evidence/       # Performance benchmarks & Security telemetry
│   ├── generated/      # Auto-generated AST docs (CI/CD injected)
│   └── manifesto.md    # The Semantic Gap philosophy
├── sentinel-stack/     # Git Submodule for core repositories
├── astro.config.mjs    # Starlight portal configuration
└── .github/workflows/  # Automated deployment & AST extraction pipeline
```

## Local Development

To run the documentation portal locally:

```bash
# Install dependencies
npm install

# Pull the core submodules for AST generation
git submodule update --init --recursive

# Start the Astro dev server
npm run dev
```