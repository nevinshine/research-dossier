"use client";

import React, { useEffect, useState, useRef } from "react";

interface TelemetryData {
  timestamp: number;
  throughput_pps: number;
  throughput_mbps: number;
  lru_evictions: number;
  telos_drops: number;
}

export default function LabTelemetryDashboard() {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [status, setStatus] = useState<"connecting" | "connected" | "offline">("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  
  // Use a simulated fallback if no actual lab WS is available, preserving visual fidelity
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_LAB_WS_URL || "ws://localhost:3777/api/telemetry";
    
    // Attempt real connection
    try {
      // We wrap in a try-catch for local execution without a backend
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => setStatus("connected");
      
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as TelemetryData;
          setData((prev) => [...prev.slice(-49), payload]);
        } catch (e) {
          // ignore parsing errors
        }
      };
      
      ws.onerror = () => {
        // Fallback to offline/simulation mode
        setStatus("offline");
      };
      
      ws.onclose = () => {
        setStatus("offline");
      };
    } catch (e) {
      setStatus("offline");
    }

    // Offline simulation loop if we can't connect to the lab API
    let interval: NodeJS.Timeout;
    if (status === "offline") {
      interval = setInterval(() => {
        const simulatedPayload: TelemetryData = {
          timestamp: Date.now(),
          throughput_pps: Math.floor(Math.random() * 50000) + 100000,
          throughput_mbps: Math.random() * 2 + 1,
          lru_evictions: Math.floor(Math.random() * 5),
          telos_drops: Math.floor(Math.random() * 12),
        };
        setData((prev) => [...prev.slice(-49), simulatedPayload]);
      }, 1000);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // SVG Chart rendering
  const maxPps = Math.max(...data.map(d => d.throughput_pps), 150000);
  const maxDrops = Math.max(...data.map(d => d.telos_drops), 20);

  return (
    <div className="my-8 border border-terminal-border bg-terminal-surface rounded-lg overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b border-terminal-border flex items-center justify-between bg-terminal-base/50">
        <div className="flex items-center gap-3">
          <h4 className="font-mono text-sm font-bold text-terminal-fg m-0">Lab Telemetry Bridge</h4>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-terminal-base border border-terminal-border">
            <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-terminal-accent animate-pulse-glow' : status === 'connecting' ? 'bg-terminal-yellow animate-pulse' : 'bg-terminal-red'}`} />
            <span className="font-mono text-[10px] uppercase text-terminal-muted">{status}</span>
          </div>
        </div>
        <div className="font-mono text-[10px] text-terminal-muted">
          WebSocket API
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Throughput */}
        <div className="border border-terminal-border/50 rounded p-3 bg-terminal-base">
          <div className="font-mono text-[10px] text-terminal-muted mb-1">NIC Throughput (PPS)</div>
          <div className="font-mono text-xl text-terminal-accent mb-3">
            {data.length > 0 ? (data[data.length - 1].throughput_pps / 1000).toFixed(1) + "k" : "---"}
          </div>
          <div className="h-16 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div 
                key={i} 
                className="flex-1 bg-terminal-accent/30 hover:bg-terminal-accent transition-colors"
                style={{ height: `${(d.throughput_pps / maxPps) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Metric 2: LRU Evictions */}
        <div className="border border-terminal-border/50 rounded p-3 bg-terminal-base">
          <div className="font-mono text-[10px] text-terminal-muted mb-1">LRU Map Evictions/sec</div>
          <div className="font-mono text-xl text-terminal-yellow mb-3">
            {data.length > 0 ? data[data.length - 1].lru_evictions : "---"}
          </div>
          <div className="h-16 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div 
                key={i} 
                className="flex-1 bg-terminal-yellow/30 hover:bg-terminal-yellow transition-colors"
                style={{ height: `${(d.lru_evictions / 10) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Metric 3: Telos Drops */}
        <div className="border border-terminal-border/50 rounded p-3 bg-terminal-base">
          <div className="font-mono text-[10px] text-terminal-muted mb-1">Telos API Drops/sec</div>
          <div className="font-mono text-xl text-terminal-red mb-3">
            {data.length > 0 ? data[data.length - 1].telos_drops : "---"}
          </div>
          <div className="h-16 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div 
                key={i} 
                className="flex-1 bg-terminal-red/30 hover:bg-terminal-red transition-colors"
                style={{ height: `${(d.telos_drops / maxDrops) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {status === "offline" && (
        <div className="px-4 py-2 border-t border-terminal-border bg-terminal-red/5">
          <p className="font-mono text-[10px] text-terminal-red m-0">
            [!] Lab API unreachable. Displaying simulated telemetry sequence for demonstration.
          </p>
        </div>
      )}
    </div>
  );
}
