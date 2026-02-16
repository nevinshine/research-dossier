---
title: Research Journal (2026)
description: Daily Engineering Logs
---

### Feb 16: Telos Architecture Integration
* **Focus:** Integrating Telos (Agent Security) into the main architecture graph.
* **Challenge:** The graph was too vertical. Switched to `graph TD` with subgraph clusters to show the 4-phase pipeline.
* **Outcome:** Successfully mapped the flow from `Browser Eye` -> `Cortex` -> `Kernel`.

### Feb 15: Sentinel-CC Phase 2 Complete
* **Focus:** Solving the ASLR and ROP problem in Sentinel-CC.
* **Achievement:** Implemented "Deep CFI" using eBPF stack walking (`bpf_get_stack`).
* **Technical Win:** Successfully mapped dynamic libraries using an `LPM_TRIE` (Map-of-Maps approach). Now Sentinel protects `glibc` calls, not just the main binary.
* **Outcome:** The system now withstands ROP attacks that try to reuse valid syscall sites.

### Feb 14: Hyperion Benchmarks
* **Focus:** Verified XDP throughput on the new 10GbE cards.
* **Result:** Hit **65.28 Gbps** with full DPI enabled.
* **Note:** The "Slight Increase" in throughput with DPI is weird. Suspect XDP is dropping packets so fast it clears the RX ring buffer, artificially inflating "processed" numbers. Need to investigate `ethtool -S` stats next week.

### Jan 30: Sentinel TOCTOU Patch
* **Focus:** Blocking `mmap(PROT_EXEC)`.
* **Code:** Added `security_mmap_file` hook in `sentinel_lsm.c`.
* **Blocker:** The JIT compiler for Java crashes because it *needs* RWX memory.
* **Fix:** Whitelisted the JVM PID for now. Need a better solution for Phase 7.

