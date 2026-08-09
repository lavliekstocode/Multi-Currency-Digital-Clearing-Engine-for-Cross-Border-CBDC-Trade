import { useGetDashboardSummary } from "@workspace/api-client-react";

export default function MetricsBar() {
  const { data: summary } = useGetDashboardSummary();

  return (
    <div className="grid grid-cols-6 border-b border-border-dark shrink-0">
      <div className="border-r border-border-dark p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Transactions</div>
        <div className="text-2xl font-bold text-slate-100">{summary?.totalTransactions ?? 8}</div>
        <div className="text-[10px] text-green-400 mt-1">+3 this session</div>
      </div>
      <div className="border-r border-border-dark p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Success Rate</div>
        <div className="text-2xl font-bold text-slate-100">
          {summary?.successRate ?? 100}<span className="text-sm font-normal text-slate-400">%</span>
        </div>
        <div className="text-[10px] text-green-400 mt-1">Perfect record</div>
      </div>
      <div className="border-r border-border-dark p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Volume</div>
        <div className="text-2xl font-bold text-slate-100">
          ${summary?.totalVolumeM ?? 21.5}<span className="text-sm font-normal text-slate-400">M</span>
        </div>
        <div className="text-[10px] text-green-400 mt-1">↑ +8% vs baseline</div>
      </div>
      <div className="border-r border-border-dark p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Avg Settlement Cost</div>
        <div className="text-2xl font-bold text-slate-100">
          {summary?.avgCostBps ?? 13.0}<span className="text-sm font-normal text-slate-400">bps</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">→ Stable</div>
      </div>
      <div className="border-r border-border-dark p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Avg Latency</div>
        <div className="text-2xl font-bold text-slate-100">
          {summary?.avgLatencyS ?? 40.1}<span className="text-sm font-normal text-slate-400">s</span>
        </div>
        <div className="text-[10px] text-green-400 mt-1">↓ –2s vs avg</div>
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Corridors</div>
        <div className="text-2xl font-bold text-slate-100">{summary?.activeCorridors ?? 30}</div>
        <div className="text-[10px] text-slate-400 mt-1">{summary?.activeNodes ?? 7} CBDC nodes</div>
      </div>
    </div>
  );
}
