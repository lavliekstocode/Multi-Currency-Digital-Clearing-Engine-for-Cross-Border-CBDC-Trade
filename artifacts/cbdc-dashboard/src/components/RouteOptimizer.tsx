import { useState } from "react";
import { useOptimizeRoute, useSettleTransaction } from "@workspace/api-client-react";

export default function RouteOptimizer({ weights }: { weights: any }) {
  const [srcCurrency, setSrcCurrency] = useState("INR");
  const [tgtCurrency, setTgtCurrency] = useState("USD");
  const [amount, setAmount] = useState(835000000);
  const [purposeCode, setPurposeCode] = useState("Trade Settlement (T1)");
  const [entityType, setEntityType] = useState("Tier 1 Commercial Bank");

  const optimizeMutation = useOptimizeRoute();

  const handleCompute = () => {
    optimizeMutation.mutate({
      data: {
        srcCurrency,
        tgtCurrency,
        amount,
        purposeCode,
        entityType,
        alphaWeight: weights.alpha,
        betaWeight: weights.beta,
        gammaWeight: weights.gamma,
        deltaWeight: weights.delta,
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Transaction Route Optimizer</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time pathfinding via Dijkstra</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="rounded-xl border border-border-dark bg-card-dark p-5 flex flex-col gap-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">Transaction Config</div>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Source Currency</label>
              <select value={srcCurrency} onChange={e => setSrcCurrency(e.target.value)} className="w-full bg-bg-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary">
                {["INR", "USD", "EUR", "GBP", "SGD", "CNY", "AED"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Destination Currency</label>
              <select value={tgtCurrency} onChange={e => setTgtCurrency(e.target.value)} className="w-full bg-bg-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary">
                {["INR", "USD", "EUR", "GBP", "SGD", "CNY", "AED"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-bg-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <button onClick={handleCompute} className="w-full bg-primary hover:bg-blue-700 text-white text-sm font-bold rounded-lg py-2.5 transition-colors mt-auto">
            Recalculate Optimal Route
          </button>
        </div>

        <div className="col-span-2 rounded-xl border border-border-dark bg-card-dark p-5">
          <div className="text-slate-400 text-sm">Route visualization here</div>
          {optimizeMutation.data && (
            <div className="mt-4 p-4 bg-bg-dark border border-border-dark rounded-lg">
              Optimal Route: {optimizeMutation.data.optimalRoute.join(" → ")}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border-dark bg-card-dark p-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Routing Analysis</div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg py-2.5 transition-colors mt-4">
            Execute Settlement
          </button>
        </div>
      </div>
    </div>
  );
}
