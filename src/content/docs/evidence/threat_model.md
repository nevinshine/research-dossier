---
title: Threat Model & Analysis
description: Analysis againist MITRE ATT&CK
---
We evaluate Sentinel-CC against the **MITRE ATT&CK** framework.

### Covered Vectors

| Tactic | Technique | Sentinel Defense |
| :--- | :--- | :--- |
| **Execution** | Native API (T1106) | Blocked by Whitelist (Caller Validation) |
| **Persistence** | BPF Implant (T1546) | Blocked by `sys_bpf` Trap |
| **Defense Evasion** | Indirect Syscalls | Blocked by Deep CFI (Stack Check) |
| **C2** | Standard Protocol | Blocked by Hyperion (Payload Inspection) |

### Residual Risk

* **JIT Spraying:** Currently, Sentinel-CC does not validate dynamically generated code (Phase 4 Roadmap).
* **Kernel Exploits:** If the kernel itself is compromised (Ring 0 exploit), the eBPF hooks can be bypassed.
