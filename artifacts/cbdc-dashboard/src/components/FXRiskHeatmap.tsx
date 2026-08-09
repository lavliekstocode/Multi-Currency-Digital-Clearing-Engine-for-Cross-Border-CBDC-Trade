export default function FXRiskHeatmap() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">FX Risk Matrix</h1>
          <p className="text-sm text-slate-400 mt-1">Cross-currency volatility regime tracking</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-border-dark bg-card-dark p-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Risk Heatmap</div>
          <div className="text-slate-500 text-sm">Heatmap visualization here</div>
        </div>
        <div className="rounded-xl border border-border-dark bg-card-dark p-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">High Risk Pairs</div>
          <div className="text-slate-500 text-sm">List here</div>
        </div>
      </div>
    </div>
  );
}
