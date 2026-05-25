---
title: The Manifesto
description: The Semantic Gap and Research Vision
---
**Systems Security Research Dossier // 2026**

:::tip[Research Statement]
**Modern security fails because of the Semantic Gap:** The compiler knows *what* the program should do, but the kernel only sees *what* the program is doing.

My research bridges this gap by embedding **Compile-Time Intent** into **Runtime Enforcement** using eBPF and Cryptographic Binding.
:::

## The "Trinity" Architecture

My work focuses on three distinct enforcement boundaries:

1.  **Build Time:** [Sentinel-CC](../architecture/sentinel_cc/) (Static Intent)
2.  **Runtime Host:** [Sentinel Runtime](../architecture/sentinel_runtime/) (Process Lineage)
3.  **Network Edge:** [Hyperion XDP](../architecture/hyperion/) (Wire-Speed Containment)
