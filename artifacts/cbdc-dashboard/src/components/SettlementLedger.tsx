import { useListTransactions } from "@workspace/api-client-react";

export default function SettlementLedger({ showFx = false }: { showFx?: boolean }) {
  const { data: transactions } = useListTransactions({ limit: 10 });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-border-dark">
            <th className="px-5 py-2.5 text-left font-bold">{showFx ? "Timestamp" : "TXID"}</th>
            <th className="px-5 py-2.5 text-left font-bold">{showFx ? "Pair" : "Corridor"}</th>
            <th className="px-5 py-2.5 text-left font-bold">Amount</th>
            <th className="px-5 py-2.5 text-left font-bold">Status</th>
            {!showFx && <th className="px-5 py-2.5 text-left font-bold">Time</th>}
            {showFx && <th className="px-5 py-2.5 text-left font-bold">Exch Rate</th>}
            {showFx && <th className="px-5 py-2.5 text-left font-bold">Risk Score</th>}
          </tr>
        </thead>
        <tbody>
          {transactions?.map((t, i) => (
            <tr key={t.id} className="border-b border-border-dark/50 hover:bg-slate-800/20 transition-colors">
              <td className="px-5 py-3 font-mono text-[11px] text-primary">
                {showFx ? new Date(t.createdAt).toLocaleTimeString() : t.txHash?.slice(0, 10) ?? t.id}
              </td>
              <td className="px-5 py-3 font-semibold text-slate-200">{t.srcCurrency}/{t.tgtCurrency}</td>
              <td className="px-5 py-3 font-mono text-slate-200">${t.amount}</td>
              <td className="px-5 py-3">
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${t.status === "SETTLED" ? "bg-green-500" : "bg-amber-400"}`}></span>
                  <span className={t.status === "SETTLED" ? "text-green-400" : "text-amber-400"}>{t.status}</span>
                </span>
              </td>
              {!showFx && <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{new Date(t.createdAt).toLocaleTimeString()}</td>}
              {showFx && <td className="px-5 py-3 font-mono text-slate-200">1.0</td>}
              {showFx && <td className="px-5 py-3 font-mono text-green-400">0.05</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
