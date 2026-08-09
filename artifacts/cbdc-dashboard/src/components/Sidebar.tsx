import { useGetDashboardSummary } from "@workspace/api-client-react";

interface Weights {
  alpha: number;
  beta: number;
  gamma: number;
  delta: number;
}

interface SidebarProps {
  weights: Weights;
  onWeightsChange: (w: Weights) => void;
}

export default function Sidebar({ weights, onWeightsChange }: SidebarProps) {
  const { data: summary } = useGetDashboardSummary();

  const handleWeightChange = (key: keyof Weights, value: string) => {
    onWeightsChange({ ...weights, [key]: parseFloat(value) });
  };

  const applyChanges = () => {
    // Visual apply button logic
  };

  return (
    <aside className="w-56 border-r border-border-dark bg-card-dark flex flex-col p-4 gap-5 shrink-0 overflow-y-auto">
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Routing Parameters</h3>
        <div className="space-y-1">
          {/* Alpha */}
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-2.5 border border-primary/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">settings_input_component</span>
              <span className="text-xs font-semibold text-slate-200">α Cost</span>
            </div>
            <span className="text-xs font-mono text-primary">{weights.alpha.toFixed(2)}</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-2 px-2.5">
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={weights.alpha}
              onChange={(e) => handleWeightChange("alpha", e.target.value)}
              className="w-full h-1 appearance-none bg-slate-700 rounded accent-primary cursor-pointer"
            />
          </div>

          {/* Beta */}
          <div className="flex items-center justify-between rounded-lg hover:bg-slate-800/40 p-2.5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-sm">build</span>
              <span className="text-xs font-medium text-slate-300">β FX Risk</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{weights.beta.toFixed(2)}</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-2 px-2.5">
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={weights.beta}
              onChange={(e) => handleWeightChange("beta", e.target.value)}
              className="w-full h-1 appearance-none bg-slate-700 rounded accent-primary cursor-pointer"
            />
          </div>

          {/* Gamma */}
          <div className="flex items-center justify-between rounded-lg hover:bg-slate-800/40 p-2.5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-sm">schedule</span>
              <span className="text-xs font-medium text-slate-300">γ Time</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{weights.gamma.toFixed(2)}</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-2 px-2.5">
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={weights.gamma}
              onChange={(e) => handleWeightChange("gamma", e.target.value)}
              className="w-full h-1 appearance-none bg-slate-700 rounded accent-primary cursor-pointer"
            />
          </div>

          {/* Delta */}
          <div className="flex items-center justify-between rounded-lg hover:bg-slate-800/40 p-2.5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-sm">gavel</span>
              <span className="text-xs font-medium text-slate-300">δ Compliance</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{weights.delta.toFixed(2)}</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-2 px-2.5">
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={weights.delta}
              onChange={(e) => handleWeightChange("delta", e.target.value)}
              className="w-full h-1 appearance-none bg-slate-700 rounded accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">System Stats</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-slate-400">Node Load</span>
              <span className="text-slate-100">{summary?.nodeLoad ?? 42}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${summary?.nodeLoad ?? 42}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-slate-400">Queue Depth</span>
              <span className="text-slate-100">{summary?.queueDepthMs ?? 12}ms</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(summary?.queueDepthMs ?? 12) / 2}%` }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-slate-400">Success Rate</span>
              <span className="text-green-400">{summary?.successRate ?? 100}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${summary?.successRate ?? 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Engine Stats</h3>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between"><span className="text-slate-400">Transactions</span><span className="font-mono text-slate-100">{summary?.totalTransactions ?? 8}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Volume</span><span className="font-mono text-slate-100">${summary?.totalVolumeM ?? 21.5}M</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Total Cost</span><span className="font-mono text-amber-400">${(summary?.totalCost ?? 104000).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">CBDC Nodes</span><span className="font-mono text-slate-100">{summary?.activeNodes ?? 7}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Corridors</span><span className="font-mono text-slate-100">{summary?.activeCorridors ?? 30}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Algorithm</span><span className="font-mono text-primary">Dijkstra</span></div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="rounded-lg border border-border-dark bg-bg-dark p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Node Status</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <div className="text-xs font-medium">Global Clearing Node</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">All {summary?.activeNodes ?? 7} nodes operational</div>
          <div className="h-1 w-full bg-slate-800 rounded mt-2 overflow-hidden">
            <div className="h-full bg-green-500 rounded" style={{ width: "100%" }}></div>
          </div>
        </div>
        <button onClick={applyChanges} className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-sm">tune</span> Apply Changes
        </button>
      </div>
    </aside>
  );
}
