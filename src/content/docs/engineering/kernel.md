---
title: Kernel Engineering (eBPF)

description: eBPF Enforcement Engine
---
The core enforcement engine relies on **LSM Hooks** and **Map-of-Maps** lookups to handle ASLR.

### The "Map-of-Maps" Design

To support shared libraries, we use an outer map keyed by `module_id` and an inner map keyed by `offset`.

```c
// Outer Map: Registry of Modules
struct {
    __uint(type, BPF_MAP_TYPE_ARRAY_OF_MAPS);
    __uint(max_entries, 64);
    __type(key, u32);
    __array(values, struct inner_policy_map);
} policy_registry SEC(".maps");

// Implementation: The Lookup Logic
static __always_inline int check_policy(u64 ip) {
    // 1. Resolve Module from IP (LPM Trie)
    // 2. Calculate Relative Offset
    // 3. Check Inner Map
}

```

> [!NOTE]
> **Endianness Handling**
> Note that `LPM_TRIE` keys require Big Endian formatting, necessitating a `__builtin_bswap64()` call on x86 architectures.

