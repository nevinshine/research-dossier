"use client";

import React from "react";

const layers = [
  { ring: "Ring -1", label: "Hypervisor", component: "sentinel-vmi", tech: "AMD-V / NPT Guard / ARMv8 EL2", objective: "Out-of-band Hypervisor Introspection", href: "/engineering/sentinel-vmi/overview", color: "#E06C75" },
  { ring: "Ring 0", label: "Compile", component: "telos-lang", tech: "Rust / LLVM / Z3 SMT", objective: "Intent-to-eBPF compiler with formal verification", href: "/engineering/telos-lang/overview", color: "#E5C07B" },
  { ring: "Ring 0", label: "Runtime", component: "telos-runtime", tech: "eBPF-LSM", objective: "Intent correlation, IFC, and Taint Tracking", href: "/engineering/telos-runtime/overview", color: "#C678DD" },
  { ring: "Verify", label: "Pipeline", component: "sentinel-kv", tech: "LLVM IR / Z3 / Ed25519", objective: "Static memory-safety analysis, ring attestation", href: "/engineering/sentinel-kv/overview", color: "#98C379" },
  { ring: "Wire", label: "NIC", component: "hyperion-xdp", tech: "XDP / eBPF", objective: "Wire-speed network drop and proxy enforcement", href: "/engineering/hyperion-xdp/overview", color: "#56B6C2" },
];

export default function InteroperabilityMatrix() {
  return (
    <div className="my-6 rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-terminal-border">
        <h4 className="font-mono text-sm font-bold text-terminal-accent m-0 p-0 border-none">Architectural Interoperability Matrix</h4>
        <p className="font-mono text-xs text-terminal-muted mt-0.5 mb-0">Cross-layer enforcement topology</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-terminal-accent">
              <th className="text-left px-4 py-2.5 text-terminal-accent font-semibold">Layer</th>
              <th className="text-left px-4 py-2.5 text-terminal-accent font-semibold">Component</th>
              <th className="text-left px-4 py-2.5 text-terminal-accent font-semibold">Technology</th>
              <th className="text-left px-4 py-2.5 text-terminal-accent font-semibold">Objective</th>
            </tr>
          </thead>
          <tbody>
            {layers.map((layer, idx) => (
              <tr key={idx} className="border-b border-terminal-border/50 hover:bg-terminal-surface-hover transition-colors group">
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                    <span className="text-terminal-muted">{layer.ring}</span>
                    <span className="text-terminal-fg">({layer.label})</span>
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <a href={layer.href} className="text-terminal-accent hover:underline font-semibold">{layer.component}</a>
                </td>
                <td className="px-4 py-2.5 text-terminal-fg">{layer.tech}</td>
                <td className="px-4 py-2.5 text-terminal-muted">{layer.objective}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
