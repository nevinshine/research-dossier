---
title: Network Engineering (XDP)
description: XDP Core & Telemetry
---
Hyperion implements a split-plane architecture: the **Control Plane** (Go) manages lifecycle, while the **Data Plane** (Restricted C) executes packet logic.

## The Telemetry Engine (M5)

To achieve observability without overhead, we define a structured event format that is pushed to a Ring Buffer.

```c
// src/kern/hyperion_core.c

// Structured Event (Aligns to 64-bit boundaries)
struct hyp_event {
    __u8 event_type;    // 0=ACCEPT, 1=DROP, 2=SIG_MATCH
    __u8 _pad1[3];      
    __u32 src_ip;
    __u32 dst_ip;
    __u16 src_port;
    __u16 dst_port;
    __u8 protocol;
    __u64 timestamp;
    char signature[8];  // Captured payload snippet
};

// High-Performance Ring Buffer
struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 1 << 16); // 64KB Buffer
} telemetry_ringbuf SEC(".maps");

```

## Stateful Flow Tracking

Hyperion maintains a "Flow Table" in kernel memory using an LRU (Least Recently Used) Hash Map. This allows it to track connection stats even at millions of packets per second.

```c
struct flow_value {
    __u64 packets;
    __u64 bytes;
    __u64 first_seen;
    __u64 last_seen;
};

// Atomic Update in XDP Context
struct flow_value *fval = bpf_map_lookup_elem(&flow_map, &fkey);
if (fval) {
    __sync_fetch_and_add(&fval->packets, 1);
    __sync_fetch_and_add(&fval->bytes, pkt_len);
    fval->last_seen = now;
}

```

:::tip[Engineering Note]
We use `__sync_fetch_and_add` (atomic intrinsics) to ensure counter accuracy even when processing packets on multiple CPU cores simultaneously.
:::