import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useListNodes, useListCorridors } from "@workspace/api-client-react";
import SettlementLedger from "./SettlementLedger";

const COLORS: Record<string, string> = {
  USD: "#2563EB", EUR: "#7C3AED", GBP: "#0891b2",
  INR: "#d97706", SGD: "#dc2626", CNY: "#be185d", AED: "#059669"
};

const NET_POS: Record<string, [number, number]> = {
  USD: [390, 190], EUR: [175, 110], GBP: [155, 280],
  INR: [600, 280], SGD: [565, 100], CNY: [440, 45], AED: [295, 320]
};

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data: nodes } = useListNodes();
  const { data: corridors } = useListCorridors();

  useEffect(() => {
    if (!svgRef.current) return;
    
    const H = 360;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 740 ${H}`);

    const defs = svg.append("defs");
    ["normal", "highlight"].forEach(t => {
      defs.append("marker")
        .attr("id", `arrow-network-${t}`)
        .attr("viewBox", "0 0 8 8")
        .attr("refX", 7)
        .attr("refY", 4)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L0,8 L8,4 Z")
        .attr("fill", t === "highlight" ? "#F59E0B" : "rgba(255,255,255,0.2)");
    });

    // Default graph drawing for corridors
    const activeCorridors = corridors ?? [];
    activeCorridors.forEach(c => {
      const src = c.srcCurrency;
      const tgt = c.tgtCurrency;
      if (!NET_POS[src] || !NET_POS[tgt]) return;
      const [x1, y1] = NET_POS[src];
      const [x2, y2] = NET_POS[tgt];
      
      const dx = x2 - x1, dy = y2 - y1;
      const cpX = (x1 + x2) / 2 + dy * 0.15, cpY = (y1 + y2) / 2 - dx * 0.15;
      
      const friction = c.friction ?? 0.05;
      const edgeColor = friction > 0.25 ? "#ef4444" : friction > 0.1 ? COLORS[src] : "#64748b";

      svg.append("path")
        .attr("d", `M${x1},${y1} Q${cpX},${cpY} ${x2},${y2}`)
        .attr("fill", "none")
        .attr("stroke", edgeColor)
        .attr("stroke-width", Math.max(1, (1 - friction) * 2.5))
        .attr("opacity", 0.35)
        .attr("marker-end", `url(#arrow-network-normal)`);
    });

    const activeNodes = nodes ?? [
      { currency: "USD", name: "FedNow" },
      { currency: "EUR", name: "ECB" },
      { currency: "GBP", name: "BoE" },
      { currency: "INR", name: "Digital Rupee" },
      { currency: "SGD", name: "MAS" },
      { currency: "CNY", name: "e-CNY" },
      { currency: "AED", name: "CBUAE" },
    ];

    activeNodes.forEach(node => {
      const ccy = node.currency;
      if (!NET_POS[ccy]) return;
      const [x, y] = NET_POS[ccy];
      const nodeSize = 25; // fixed size for simplicity

      const g = svg.append("g").attr("transform", `translate(${x},${y})`).style("cursor", "pointer");

      g.append("circle")
        .attr("r", nodeSize)
        .attr("fill", COLORS[ccy] || "#333")
        .attr("stroke", "rgba(255,255,255,0.1)")
        .attr("stroke-width", 1);
      
      g.append("circle")
        .attr("r", nodeSize)
        .attr("fill", "rgba(255,255,255,0.06)");
      
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#fff")
        .attr("font-size", 10)
        .attr("font-weight", "700")
        .text(ccy);
    });

  }, [nodes, corridors]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Global CBDC Network</h1>
          <p className="text-sm text-slate-400 mt-1">Live settlement topology across 7 sovereign CBDC nodes and 30 bilateral corridors</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-400">Global Node Status: Stable</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl border border-border-dark bg-card-dark overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-dark">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">public</span>
              <span className="text-sm font-semibold text-slate-100">Global CBDC Network Graph</span>
            </div>
          </div>
          <svg ref={svgRef} className="w-full h-[360px]"></svg>
          <div className="px-5 py-3 border-t border-border-dark bg-bg-dark/50 flex flex-wrap gap-2">
            {["INR", "USD", "EUR", "GBP", "SGD", "CNY", "AED"].map((n) => (
              <span key={n} className="text-[11px] font-mono bg-slate-800 border border-border-dark text-slate-300 px-2.5 py-0.5 rounded">{n}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px]">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Corridor Statistics</div>
          {corridors?.slice(0, 5).map((c) => (
            <div key={c.id} className="rounded-lg border border-border-dark bg-bg-dark p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100">{c.srcCurrency}→{c.tgtCurrency} Corridor</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div><div className="text-[9px] text-slate-500 uppercase tracking-widest">FX RATE</div><div className="text-xs font-mono text-slate-200">{c.fxRate.toFixed(5)}</div></div>
                <div><div className="text-[9px] text-slate-500 uppercase tracking-widest">LATENCY</div><div className="text-xs font-mono text-green-400">{c.latencyS}s</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Strip */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-border-dark bg-card-dark p-4 text-center">
          <div className="text-xl font-bold text-slate-100">7</div><div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">CBDC Nodes</div>
        </div>
        <div className="rounded-xl border border-border-dark bg-card-dark p-4 text-center">
          <div className="text-xl font-bold text-slate-100">30</div><div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Corridors</div>
        </div>
        <div className="rounded-xl border border-border-dark bg-card-dark p-4 text-center">
          <div className="text-xl font-bold text-amber-400">10.5</div><div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Avg Cost bps</div>
        </div>
        <div className="rounded-xl border border-border-dark bg-card-dark p-4 text-center">
          <div className="text-xl font-bold text-slate-100">38s</div><div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Avg Latency</div>
        </div>
        <div className="rounded-xl border border-border-dark bg-card-dark p-4 text-center">
          <div className="text-xl font-bold text-green-400">0.133</div><div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Avg Friction</div>
        </div>
      </div>

      <div className="rounded-xl border border-border-dark bg-card-dark overflow-hidden">
        <SettlementLedger showFx={false} />
      </div>
    </div>
  );
}
