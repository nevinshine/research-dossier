---
title: Research Roadmap & Maturity Model
description: Future Work & Telos
---
This document outlines the trajectory of **Sentinel-CC** from its current state as a functional research prototype to a production-grade kernel security architecture.

## The Sentinel-CC Maturity Model

We classify the system's evolution into four distinct Levels of Assurance (L1–L4).

```mermaid
graph TD
    %% Styling
    classDef done fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef critical fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef research fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef phd fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#e65100
    classDef prod fill:#eceff1,stroke:#455a64,stroke-width:2px,color:#263238

    subgraph L1 ["L1: Functional Prototype (TRL 4) - COMPLETED"]
        direction TB
        P1("Phase 1: Trust Chain<br/>Static PCC & Signatures"):::done
        P2("Phase 2: Dynamic Enforcer<br/>ASLR + Deep CFI"):::done
        P1 --> P2
    end

    subgraph L2 ["L2: Robust Research System (TRL 5-6) - PUBLISHABLE"]
        direction TB
        P3("Phase 3: Recursive Trust<br/>Library Dependency Graph"):::research
        P6("Phase 6: Continuous Integrity<br/>Anti-TOCTOU / W^X / JIT"):::critical
        P8("Phase 8: Performance<br/>Benchmarks & Overhead < 5%"):::research
        
        P2 -.-> P3
        P3 --> P6
        P6 --> P8
    end

    subgraph L3 ["L3: Scalable Architecture (TRL 7) - PhD LEVEL"]
        direction TB
        P7("Phase 7: Scalability<br/>Policy Compression & Hierarchy"):::phd
        P9("Phase 9: Adversarial<br/>Threat Modeling & Red Teaming"):::phd
        RA("Remote Attestation<br/>TPM & Hardware Root"):::phd
        
        P8 -.-> P7
        P7 --> P9
        P9 --> RA
    end

    subgraph L4 ["L4: Production Assurance (TRL 8-9) - INDUSTRY"]
        direction TB
        P11("Phase 11: Formal Methods<br/>Proofs of Soundness"):::prod
        P10("Phase 10: Deployment<br/>Transparent Loading / Package Mgr"):::prod
        
        RA -.-> P11
        P11 --> P10
    end

    %% Legend
    linkStyle default stroke-width:2px,fill:none,stroke:gray

```

---

## Roadmap Analysis

### L1: Functional Prototype (Current Status)

* **Status:** Complete.
* **Capabilities:** Enforces static policy, handles ASLR (Map-of-Maps), validates Call Stacks (CFI).
* **Limitations:** Vulnerable to dynamic code injection (TOCTOU) and assumes a static `libc` layout.

### L2: The "Publication" Tier (Next Priority)

To elevate Sentinel-CC to a Tier-1 research artifact (e.g., Usenix Security), the following gaps must be closed:

* **Phase 6: Continuous Runtime Integrity (Critical)**
* **Problem:** An attacker can use `mmap(PROT_EXEC)` or `dlopen` after the initial verification to inject malicious code.
* **Solution:** Hook `mmap` and `mprotect` to enforce **W^X** (Write XOR Execute) and block anonymous executable mappings.


* **Phase 8: Performance Validation**
* **Goal:** Prove that the overhead is **< 5%** compared to native execution using standard benchmarks (`stress-ng`).



### L3: The High Tier (Long Term)

* **Phase 7: Scalability:** Handling massive applications (e.g., Chrome) by implementing hierarchical, function-level policies instead of instruction-level offsets.
* **Remote Attestation:** Integrating with **Project Telos** to provide a TPM-signed cryptographic "Quote" proving the kernel agent is active and untampered.

---

## Execution Plan (6-Month Sprint)

The immediate research focus is the **L2 Sprint**:

1. **Attack Simulation:** Develop a "Jailbreak" artifact that utilizes `mmap` shellcode injection to demonstrate the L1 limitation.
2. **Hardening (Phase 6):** Implement the BPF `mmap` hook to neutralize the jailbreak.
3. **Measurement (Phase 8):** Generate the comprehensive performance whitepaper.
