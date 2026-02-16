---
title: Sentinel Runtime - Host Intrusion Prevention
description: Host Intrusion Prevention (M8.2)
---
**Current Status:** M8.2 "Citadel" (Active Research)

Sentinel Runtime is a kernel-native security architecture designed to bridge the gap between user-space tracing and kernel-space filtering. It has evolved from a legacy `ptrace` monitor into a hybrid **Seccomp + eBPF-LSM** defense engine.

## The M8.2 "Citadel" Architecture

Unlike traditional HIDS that rely on high-overhead context switching, Sentinel M8 operates almost entirely in **Ring 0**, utilizing Linux Security Modules (LSM) to enforce policy *after* kernel path resolution.

### 1. "The Bloodline" (Inheritance Tracking)
* **The Problem:** Malware often `fork()`s rapidly or double-forks to detach from parent supervisors.
* **The Solution:** Sentinel hooks `tp_btf/sched_process_fork`. When a restricted process spawns a child, the security policy is **atomically inherited** in the kernel BPF map.
* **Result:** Restriction is inescapable. `bash` cannot spawn an unrestricted `curl` process.

### 2. "Ghost Tunnel" Block (Anti-Evasion)
* **The Problem:** Advanced rootkits use `io_uring` to perform asynchronous I/O, bypassing standard syscall auditing hooks (`auditd`, `sysdig`).
* **The Solution:** Sentinel enforces a hard BPF block on `io_uring_setup` and `io_uring_enter`.
* **Verdict:** `EPERM` is returned instantly, closing the "Ghost I/O" loophole.

### 3. Inode-Only Enforcement
* **The Problem:** Path-based rules are vulnerable to renaming/symlinks. Device ID checks fail in container namespaces.
* **The Solution:** M8.2 identifies files solely by their **Inode Number** on the superblock.
* **Benefit:** Zero false negatives caused by namespace device ID mismatches (e.g., OverlayFS quirks).

## Capability Matrix

| Feature | Legacy (M3) | Modern (M8.2) |
| :--- | :--- | :--- |
| **Mechanism** | `ptrace` (Stop-the-world) | `eBPF-LSM` + `Seccomp` |
| **Performance** | ~54x Overhead | **~1.12x Overhead** |
| **Race Conditions** | Vulnerable (TOCTOU) | **Immune (Atomic)** |
| **Persistence** | Parent-Child Only | **Recursive "Bloodline"** |