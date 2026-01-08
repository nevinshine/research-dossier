---
title: Threat Models
description: Attack Vectors and Behavioral Signatures
---

## Behavioral Signatures

Sentinel does not look for "Bad Files" (Signatures). It looks for "Bad Intent" (Behavior).

### 1. Ransomware (The Encryptor)
Ransomware has a very loud syscall profile.
* **Normal Program:** Reads a file, waits, writes to a log.
* **Ransomware:** `open` -> `read` -> `encrypt` -> `write` (Repeated 1000x/sec).
* **Detection:** A sudden spike in `read/write` syscall density targeting user documents.

### 2. The Dropper (The Loader)
Malware often starts as a small script that downloads the real weapon.
* **Signature:**
    1.  `socket` / `connect` (Network activity).
    2.  `write` (Saving payload to disk).
    3.  `mprotect` (Making memory executable).
    4.  `execve` (Running the payload).
* **Sentinel Policy:** Block `connect` followed immediately by `execve` in non-browser applications.

### 3. Evasion (Anti-Debugging)
Malware checks if it is being watched.
* **Technique:** Calling `ptrace(PTRACE_TRACEME)` on itself.
* **Result:** If it fails, the malware knows a debugger (Sentinel) is already attached, so it shuts down to hide its behavior.