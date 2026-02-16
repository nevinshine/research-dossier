---
title: Unified Defense Graph
description: The Architecture Overview
---
This diagram illustrates the **complete security pipeline**, connecting Build-Time guarantees with Runtime enforcement across Host, Network, and AI Agent boundaries.

```mermaid
graph TD
    %% --- STYLING ---
    classDef build fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef host fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef net fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#004d40
    classDef agent fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#e65100
    classDef external fill:#37474f,stroke:#37474f,stroke-width:2px,color:#fff

    %% --- PHASE 1: BUILD ---
    subgraph Build ["Phase 1: Build (Sentinel-CC)"]
        direction TB
        SRC[Source Code] -->|LLVM Pass| BIN[Binary + Policy]
        BIN -->|SignTool| SIG[Cryptographic Sig]
    end

    %% --- PHASE 4: AGENT (New) ---
    subgraph Agent ["Phase 4: AI Agent (Telos)"]
        direction TB
        WEB(Web Input) -->|Taint| EYE(Browser Eye)
        EYE -->|gRPC| CORTEX(Telos Cortex)
    end

    %% --- PHASE 2: HOST ---
    subgraph Host ["Phase 2: Host (Sentinel Runtime)"]
        direction TB
        KERN{Kernel Ring 0} -->|eBPF LSM| SENT[Sentinel Logic]
        SENT -->|Monitor| PROC[User Process]
    end

    %% --- PHASE 3: NETWORK ---
    subgraph Network ["Phase 3: Network (Hyperion)"]
        direction TB
        XDP[Hyperion XDP] -->|Filter| NET((Internet))
    end

    %% --- THE UNIFIED CONNECTIONS ---
    
    %% 1. Build -> Host (Trust Chain)
    SIG -->|Loader Verify| KERN
    
    %% 2. Agent -> Host (Intent Verification)
    CORTEX -.->|Update Maps| SENT
    
    %% 3. Host -> Network (Traffic Flow)
    PROC -->|Socket| XDP
    
    %% 4. Agent -> Network (JIT Allowlist)
    CORTEX -.->|Update Maps| XDP

    %% --- APPLY STYLES ---
    class SRC,BIN,SIG build
    class KERN,SENT,PROC host
    class XDP,NET net
    class WEB,EYE,CORTEX agent
    class NET external