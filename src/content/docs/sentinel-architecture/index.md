---
title: Sentinel Architecture
description: Technical specification of the Sentinel Runtime Verification System
---

## System Overview

Sentinel is a lightweight **Runtime Verification System** for Linux. Unlike traditional EDRs (Endpoint Detection and Response) that rely on signature matching or static binary analysis, Sentinel operates on the **Semantic Level**.

It intercepts the communication between a process and the Linux Kernel to establish a "Behavioral Fingerprint" of execution.

### The Three-Layer Design

| Layer | Component | Language | Function |
| :--- | :--- | :--- | :--- |
| **0** | **Target** | Binary | The untrusted process (e.g., malware, web server). |
| **1** | **Interceptor** | C | Attaches via `ptrace`, pauses execution, inspects memory. |
| **2** | **Brain** | Python | Analyzes syscall sequences using Isolation Forests / DWN. |

---

## Active Defense (v0.7)

As of version v0.7, Sentinel is no longer passive. It implements an **Active Policy Engine**.

### The Blocking Mechanism
When a malicious syscall is detected (e.g., `openat` on `/etc/passwd`), Sentinel does not kill the process. Instead, it performs a **Register Rewrite**:

1.  **Trap:** The process stops at Syscall Entry.
2.  **Inspect:** Sentinel reads `RDI/RSI` registers to see arguments.
3.  **Decide:** Policy Engine flags the arguments as `BANNED`.
4.  **Intervene:** Sentinel writes `-1` into the `ORIG_RAX` register.
5.  **Resume:** The kernel sees syscall `-1` (invalid), returns `ENOSYS`, and the process continues without accessing the file.

```c
// Code Snippet: The Neutralization Logic
if (is_malicious(path)) {
    regs.orig_rax = -1; // <--- The "Jedi Mind Trick"
    ptrace(PTRACE_SETREGS, child_pid, NULL, &regs);
}

```

---

## Memory Introspection

To understand *intent*, we must look beyond numbers. Sentinel uses `PTRACE_PEEKDATA` to extract string arguments from the child's virtual memory space.

* **Challenge:** The child's memory is isolated.
* **Solution:** We read word-by-word (8 bytes) at the address found in `RSI` until we hit a `NULL` terminator.

### Current Capabilities

* [x] **Syscall Identity:** Tracking `RAX` numbers.
* [x] **Argument Extraction:** Reading file paths, network IPs.
* [x] **Policy Enforcement:** Real-time blocking.

