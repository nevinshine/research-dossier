"use client";

import React, { useState } from "react";

interface MapEntry {
  name: string;
  mapType: string;
  keyType: string;
  valueType: string;
  maxEntries: number | string;
  description: string;
  color: string;
  evictionPolicy?: string;
  memorySize?: string;
}

const defaultMaps: MapEntry[] = [
  {
    name: "policy_map",
    mapType: "BPF_MAP_TYPE_ARRAY",
    keyType: "__u32 (index)",
    valueType: "struct policy_t (12B)",
    maxEntries: "MAX_RULES (2)",
    description: "Stores active signature rules for deep payload inspection. Array-indexed for O(1) lookup by rule ID. Verifier-safe with compile-time MAX_RULES bound.",
    color: "accent",
  },
  {
    name: "telemetry_ringbuf",
    mapType: "BPF_MAP_TYPE_RINGBUF",
    keyType: "N/A (ringbuf)",
    valueType: "struct hyp_event (40B)",
    maxEntries: "1 << 16 (64KB)",
    description: "Zero-copy lockless ring buffer for high-performance telemetry event export. Kernel producer submits 40-byte events; Go user-space consumer reads without syscall overhead.",
    color: "blue",
    memorySize: "64KB",
  },
  {
    name: "flow_map",
    mapType: "BPF_MAP_TYPE_LRU_HASH",
    keyType: "struct flow_key (13B)",
    valueType: "struct flow_value (32B)",
    maxEntries: "10,000",
    description: "Stateful per-flow tracking with automatic LRU eviction. Tracks packet counts, bytes, and timestamps per unique 5-tuple (src_ip, dst_ip, src_port, dst_port, protocol).",
    color: "cyan",
    evictionPolicy: "Least Recently Used (automatic)",
  },
  {
    name: "alert_ringbuf",
    mapType: "BPF_MAP_TYPE_RINGBUF",
    keyType: "N/A (ringbuf)",
    valueType: "struct event_t (24B)",
    maxEntries: "1 << 14 (16KB)",
    description: "Legacy alert channel for backward compatibility. Emits DROP events with payload snippets. Superseded by telemetry_ringbuf for structured M5 telemetry.",
    color: "yellow",
    memorySize: "16KB",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  accent: { bg: "rgba(58,217,0,0.08)", text: "#3AD900", border: "rgba(58,217,0,0.25)" },
  blue: { bg: "rgba(97,175,239,0.08)", text: "#61AFEF", border: "rgba(97,175,239,0.25)" },
  cyan: { bg: "rgba(86,182,194,0.08)", text: "#56B6C2", border: "rgba(86,182,194,0.25)" },
  yellow: { bg: "rgba(229,192,123,0.08)", text: "#E5C07B", border: "rgba(229,192,123,0.25)" },
};

export default function EbpfMapTopology({ maps = defaultMaps }: { maps?: MapEntry[] }) {
  const [activeMap, setActiveMap] = useState<MapEntry | null>(null);

  return (
    <div className="my-6 rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-terminal-border">
        <h4 className="font-mono text-sm font-bold text-terminal-accent m-0 p-0 border-none">eBPF Map Topology</h4>
        <p className="font-mono text-xs text-terminal-muted mt-0.5 mb-0">Hyperion XDP kernel-space map definitions (hyperion_core.c)</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {maps.map((map, idx) => {
          const colors = colorMap[map.color] || colorMap.accent;
          const isActive = activeMap === map;
          return (
            <button
              key={idx}
              onClick={() => setActiveMap(isActive ? null : map)}
              className="text-left p-3 rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: isActive ? colors.bg.replace(/[\d.]+\)$/, "0.15)") : colors.bg,
                borderColor: isActive ? colors.text : colors.border,
                boxShadow: isActive ? `0 0 12px ${colors.bg.replace(/[\d.]+\)$/, "0.3)")}` : "none",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold" style={{ color: colors.text }}>{map.name}</span>
                {map.evictionPolicy && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-terminal-base text-terminal-muted border border-terminal-border">LRU</span>}
                {map.memorySize && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-terminal-base text-terminal-muted border border-terminal-border">{map.memorySize}</span>}
              </div>
              <div className="font-mono text-[10px] text-terminal-muted mb-1">{map.mapType}</div>
              <div className="flex gap-4 font-mono text-[10px]">
                <div><span className="text-terminal-muted">Key: </span><span style={{ color: colors.text }}>{map.keyType}</span></div>
                <div><span className="text-terminal-muted">Val: </span><span style={{ color: colors.text }}>{map.valueType}</span></div>
              </div>
              <div className="font-mono text-[10px] text-terminal-muted mt-1">max_entries: {map.maxEntries}</div>
            </button>
          );
        })}
      </div>
      {activeMap && (
        <div className="mx-4 mb-4 p-3 rounded-lg bg-terminal-base border border-terminal-border animate-fade-in">
          <p className="font-mono text-xs text-terminal-fg m-0 leading-relaxed">{activeMap.description}</p>
          {activeMap.evictionPolicy && (
            <p className="font-mono text-[10px] text-terminal-cyan mt-2 mb-0">Eviction: {activeMap.evictionPolicy}</p>
          )}
        </div>
      )}
    </div>
  );
}
