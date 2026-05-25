"use client";

import React, { useState } from "react";

interface BitField {
  name: string;
  bits: [number, number]; // [start, end] inclusive, MSB=63
  description: string;
  value?: string;
  color: string;
}

interface RegisterMatrixProps {
  name: string;
  description: string;
  width?: 32 | 64;
  fields: BitField[];
  sourceRef?: string;
}

const fieldColors: Record<string, { bg: string; text: string; border: string }> = {
  accent: { bg: "rgba(58,217,0,0.12)", text: "#3AD900", border: "rgba(58,217,0,0.3)" },
  blue: { bg: "rgba(97,175,239,0.12)", text: "#61AFEF", border: "rgba(97,175,239,0.3)" },
  purple: { bg: "rgba(198,120,221,0.12)", text: "#C678DD", border: "rgba(198,120,221,0.3)" },
  yellow: { bg: "rgba(229,192,123,0.12)", text: "#E5C07B", border: "rgba(229,192,123,0.3)" },
  red: { bg: "rgba(224,108,117,0.12)", text: "#E06C75", border: "rgba(224,108,117,0.3)" },
  cyan: { bg: "rgba(86,182,194,0.12)", text: "#56B6C2", border: "rgba(86,182,194,0.3)" },
  orange: { bg: "rgba(209,154,102,0.12)", text: "#D19A66", border: "rgba(209,154,102,0.3)" },
  muted: { bg: "rgba(136,136,136,0.08)", text: "#888888", border: "rgba(136,136,136,0.2)" },
};

export default function RegisterMatrix({
  name,
  description,
  width = 64,
  fields,
  sourceRef,
}: RegisterMatrixProps) {
  const [hoveredField, setHoveredField] = useState<BitField | null>(null);

  // Build a bit-to-field mapping
  const bitMap: (BitField | null)[] = new Array(width).fill(null);
  for (const field of fields) {
    for (let i = field.bits[1]; i <= field.bits[0]; i++) {
      bitMap[i] = field;
    }
  }

  // Render bits in rows of 16
  const rows: number[][] = [];
  for (let i = width - 1; i >= 0; i -= 16) {
    const row: number[] = [];
    for (let j = 0; j < 16 && i - j >= 0; j++) {
      row.push(i - j);
    }
    rows.push(row);
  }

  return (
    <div className="my-6 rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-terminal-border flex items-center justify-between">
        <div>
          <h4 className="font-mono text-sm font-bold text-terminal-accent m-0 p-0 border-none">
            {name}
          </h4>
          <p className="font-mono text-xs text-terminal-muted mt-0.5 mb-0">{description}</p>
        </div>
        <span className="font-mono text-[10px] text-terminal-muted px-2 py-1 bg-terminal-base rounded border border-terminal-border">
          {width}-bit
        </span>
      </div>

      {/* Bit Matrix */}
      <div className="p-4 overflow-x-auto">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex mb-1">
            {/* Bit numbers header */}
            {rowIdx === 0 && (
              <div className="absolute -mt-5 flex" style={{ marginLeft: "0px" }}>
                {/* Bit labels above handled inside */}
              </div>
            )}
            {row.map((bitIdx) => {
              const field = bitMap[bitIdx];
              const colors = field ? fieldColors[field.color] || fieldColors.muted : fieldColors.muted;
              const isHovered = hoveredField === field && field !== null;
              const isFieldStart = field && bitIdx === field.bits[0];

              return (
                <div
                  key={bitIdx}
                  className="relative flex flex-col items-center cursor-pointer transition-all duration-150"
                  style={{ width: "40px" }}
                  onMouseEnter={() => field && setHoveredField(field)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  {/* Bit number */}
                  <span className="text-[9px] font-mono text-terminal-muted mb-0.5">
                    {bitIdx}
                  </span>
                  {/* Bit cell */}
                  <div
                    className="w-9 h-8 flex items-center justify-center border font-mono text-[10px] font-medium transition-all duration-150"
                    style={{
                      backgroundColor: isHovered
                        ? colors.bg.replace(/[\d.]+\)$/, "0.25)")
                        : colors.bg,
                      borderColor: isHovered ? colors.text : colors.border,
                      color: colors.text,
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      boxShadow: isHovered
                        ? `0 0 8px ${colors.bg.replace(/[\d.]+\)$/, "0.4)")}`
                        : "none",
                    }}
                  >
                    {isFieldStart && field
                      ? field.name.length <= 5
                        ? field.name
                        : ""
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Field Legend */}
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {fields.map((field, idx) => {
          const colors = fieldColors[field.color] || fieldColors.muted;
          const isHovered = hoveredField === field;
          return (
            <button
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[11px] transition-all duration-150 border"
              style={{
                backgroundColor: isHovered ? colors.bg.replace(/[\d.]+\)$/, "0.2)") : colors.bg,
                borderColor: isHovered ? colors.text : colors.border,
                color: colors.text,
              }}
              onMouseEnter={() => setHoveredField(field)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors.text }} />
              {field.name}
              <span className="text-terminal-muted">
                [{field.bits[0]}:{field.bits[1]}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Hover Detail */}
      {hoveredField && (
        <div
          className="mx-4 mb-4 p-3 rounded-lg border animate-fade-in"
          style={{
            backgroundColor: fieldColors[hoveredField.color]?.bg || fieldColors.muted.bg,
            borderColor: fieldColors[hoveredField.color]?.border || fieldColors.muted.border,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-sm font-bold"
              style={{ color: fieldColors[hoveredField.color]?.text }}
            >
              {hoveredField.name}
            </span>
            <span className="font-mono text-xs text-terminal-muted">
              Bits [{hoveredField.bits[0]}:{hoveredField.bits[1]}]
            </span>
            {hoveredField.value && (
              <span className="font-mono text-xs text-terminal-accent ml-auto">
                = {hoveredField.value}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-terminal-muted leading-relaxed m-0">
            {hoveredField.description}
          </p>
        </div>
      )}

      {/* Source Reference */}
      {sourceRef && (
        <div className="px-4 py-2 border-t border-terminal-border">
          <span className="font-mono text-[10px] text-terminal-muted">
            Source: {sourceRef}
          </span>
        </div>
      )}
    </div>
  );
}
