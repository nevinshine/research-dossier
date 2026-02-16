---
title: Compiler Engineering (LLVM Pass)
description: LLVM Pass Implementation
---
The **SentinelPass** is an out-of-tree LLVM optimization pass that acts as the "Intention Extractor."

### Logic Flow

```cpp
bool SentinelPass::runOnFunction(Function &F) {
    for (auto &BB : F) {
        for (auto &I : BB) {
            if (isSyscall(I)) {
                uint64_t offset = getInstructionOffset(I);
                Policy.add(offset);
            }
        }
    }
}

```

### Why LLVM?

By analyzing the **Intermediate Representation (IR)**, we gain visibility that is impossible at the binary level. We can distinguish between a valid `syscall` instruction intended by the developer and a "gadget" (random bytes that happen to look like a syscall).

