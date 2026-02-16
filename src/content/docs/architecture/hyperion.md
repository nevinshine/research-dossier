---
title: Hyperion XDP - Network Containment
description: Wire-Speed Network Containment (M5.0)
---
**Current Status:** M5.0 "Telemetry & Flow" (Active Research)

Hyperion is a high-performance network security engine designed to enforce content-aware policy at the Network Interface Card (NIC) driver level. It serves as the **Network Satellite** to the Sentinel Runtime, unifying process-level and packet-level defense.

## The "Two Towers" Defense Strategy

Hyperion complements Sentinel by securing the transport boundary before the OS commits resources.

| Dimension | Sentinel (The Host) | Hyperion (The Wire) |
| :--- | :--- | :--- |
| **Boundary** | Process Execution | Network Transport |
| **Mechanism** | `eBPF-LSM` (Ring 0) | `XDP` (Driver Level) |
| **Visibility** | Syscalls (`execve`) | Payloads (`GET /hack`) |
| **Latency** | Microsecond Scale | **Nanosecond Scale** |

## M5.0 Architecture: The "Telemetry" Update

In Milestone 5, Hyperion evolved from a simple dropper into a comprehensive network observatory.

### 1. Zero-Copy Telemetry
* **Mechanism:** `BPF_MAP_TYPE_RINGBUF`
* **Innovation:** Streams structured binary events (`ACCEPT`, `DROP`, `SIG_MATCH`) to userspace without the performance penalty of `perf_event_array`.
* **Data:** Captures 5-tuple (Src/Dst IP, Ports, Proto) + Timestamp + Matched Signature.

### 2. Flow Tracking Engine
* **Mechanism:** `BPF_MAP_TYPE_LRU_HASH`
* **Innovation:** Maintains stateful flow tables (Packets/Bytes counters) directly in the XDP context.
* **Benefit:** Allows for volumetric flood detection (DDoS) without leaving the NIC driver.

### 3. Deep Packet Inspection (DPI)
* **Mechanism:** Verifier-Safe Bounded Loops (`#pragma unroll`)
* **Logic:** Scans Layer 7 payloads for signature patterns (e.g., `root`, `admin`) at wire speed.