"use client";

import React, { useState } from "react";

interface StructField {
  name: string;
  type: string;
  size: number;
  offset: number;
  isPadding?: boolean;
  comment?: string;
}

interface Props {
  title: string;
  description: string;
  totalSize: number;
  cFields: StructField[];
  goFields: StructField[];
  cSourceFile?: string;
  goSourceFile?: string;
}

function FieldRow({ field, isHovered, onHover }: { field: StructField; isHovered: boolean; onHover: (f: StructField | null) => void }) {
  const getTypeColor = () => {
    if (field.isPadding) return "#888888";
    if (field.type.includes("64")) return "#C678DD";
    if (field.type.includes("32")) return "#61AFEF";
    if (field.type.includes("16")) return "#56B6C2";
    if (field.type.includes("8") || field.type.includes("byte")) return "#D19A66";
    if (field.type.includes("char")) return "#E5C07B";
    return "#E0E0E0";
  };

  return (
    <div
      className="flex items-center font-mono text-xs border-b border-terminal-border/50 transition-all duration-150"
      style={{ backgroundColor: field.isPadding ? "rgba(136,136,136,0.06)" : isHovered ? "rgba(58,217,0,0.1)" : "transparent" }}
      onMouseEnter={() => onHover(field)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-14 shrink-0 px-2 py-1.5 text-terminal-muted text-right border-r border-terminal-border/30">+{field.offset}</div>
      <div className="w-10 shrink-0 px-1 py-1.5 flex items-center justify-center border-r border-terminal-border/30">
        <div className="h-3 rounded-sm" style={{ width: `${Math.min(field.size * 8, 32)}px`, backgroundColor: field.isPadding ? "#555" : isHovered ? "#3AD900" : "#3AD90066", opacity: field.isPadding ? 0.3 : 1 }} />
      </div>
      <div className="w-8 shrink-0 px-1 py-1.5 text-terminal-muted text-center border-r border-terminal-border/30">{field.size}B</div>
      <div className="w-28 shrink-0 px-2 py-1.5 truncate border-r border-terminal-border/30" style={{ color: getTypeColor() }}>{field.type}</div>
      <div className={`flex-1 px-2 py-1.5 ${field.isPadding ? "text-terminal-muted italic" : "text-terminal-fg"}`}>
        {field.name}
        {field.comment && <span className="text-terminal-muted ml-2 text-[10px]">// {field.comment}</span>}
      </div>
    </div>
  );
}

export default function StructAlignmentView({ title, description, totalSize, cFields, goFields, cSourceFile, goSourceFile }: Props) {
  const [hoveredField, setHoveredField] = useState<StructField | null>(null);

  return (
    <div className="my-6 rounded-lg border border-terminal-border bg-terminal-surface overflow-x-auto">
      <div className="px-4 py-3 border-b border-terminal-border flex items-center justify-between">
        <div>
          <h4 className="font-mono text-sm font-bold text-terminal-accent m-0 p-0 border-none">{title}</h4>
          <p className="font-mono text-xs text-terminal-muted mt-0.5 mb-0">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] px-2 py-1 bg-terminal-accent/10 text-terminal-accent rounded border border-terminal-accent/20">{totalSize} bytes</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-terminal-border min-w-[600px] lg:min-w-0">
        <div>
          <div className="px-3 py-2 border-b border-terminal-border bg-terminal-base/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terminal-red" />
            <span className="font-mono text-[11px] text-terminal-red font-semibold">C (Kernel Space)</span>
            {cSourceFile && <span className="font-mono text-[10px] text-terminal-muted ml-auto">{cSourceFile}</span>}
          </div>
          <div className="flex items-center font-mono text-[10px] text-terminal-muted border-b border-terminal-border/50 bg-terminal-base/30">
            <div className="w-14 px-2 py-1 text-right border-r border-terminal-border/30">OFF</div>
            <div className="w-10 px-1 py-1 text-center border-r border-terminal-border/30">VIS</div>
            <div className="w-8 px-1 py-1 text-center border-r border-terminal-border/30">SZ</div>
            <div className="w-28 px-2 py-1 border-r border-terminal-border/30">TYPE</div>
            <div className="flex-1 px-2 py-1">FIELD</div>
          </div>
          {cFields.map((f, i) => <FieldRow key={i} field={f} isHovered={hoveredField !== null && hoveredField.offset === f.offset} onHover={setHoveredField} />)}
        </div>
        <div>
          <div className="px-3 py-2 border-b border-terminal-border bg-terminal-base/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terminal-cyan" />
            <span className="font-mono text-[11px] text-terminal-cyan font-semibold">Go (User Space)</span>
            {goSourceFile && <span className="font-mono text-[10px] text-terminal-muted ml-auto">{goSourceFile}</span>}
          </div>
          <div className="flex items-center font-mono text-[10px] text-terminal-muted border-b border-terminal-border/50 bg-terminal-base/30">
            <div className="w-14 px-2 py-1 text-right border-r border-terminal-border/30">OFF</div>
            <div className="w-10 px-1 py-1 text-center border-r border-terminal-border/30">VIS</div>
            <div className="w-8 px-1 py-1 text-center border-r border-terminal-border/30">SZ</div>
            <div className="w-28 px-2 py-1 border-r border-terminal-border/30">TYPE</div>
            <div className="flex-1 px-2 py-1">FIELD</div>
          </div>
          {goFields.map((f, i) => <FieldRow key={i} field={f} isHovered={hoveredField !== null && hoveredField.offset === f.offset} onHover={setHoveredField} />)}
        </div>
      </div>
      {hoveredField && !hoveredField.isPadding && (
        <div className="mx-4 my-3 p-3 rounded-lg bg-terminal-accent/5 border border-terminal-accent/20 animate-fade-in">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-terminal-accent font-bold">{hoveredField.name}</span>
            <span className="text-terminal-muted">offset +{hoveredField.offset} | {hoveredField.size} bytes | {hoveredField.type}</span>
          </div>
        </div>
      )}
      <div className="px-4 py-2 border-t border-terminal-border bg-terminal-base/30">
        <p className="font-mono text-[10px] text-terminal-yellow m-0 flex items-center gap-1.5">
          <span>[!]</span> Padding ensures 8-byte alignment before timestamp. C and Go must maintain exact binary parity for ringbuf consumption.
        </p>
      </div>
    </div>
  );
}
