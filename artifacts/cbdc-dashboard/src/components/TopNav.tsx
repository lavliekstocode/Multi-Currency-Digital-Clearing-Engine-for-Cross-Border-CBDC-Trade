import { TabType } from "../pages/Dashboard";
import { useEffect, useState } from "react";

interface TopNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`UTC ${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const TabButton = ({ id, label }: { id: TabType; label: string }) => (
    <button
      onClick={() => onTabChange(id)}
      className={`text-sm px-4 py-4 transition-colors ${
        activeTab === id
          ? "text-primary border-b-2 border-primary font-semibold"
          : "text-slate-400 font-medium hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-dark bg-card-dark px-6 shrink-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-2xl">hub</span>
          <h2 className="text-base font-bold tracking-tight text-slate-100">CBDC Clearing Engine</h2>
        </div>
        <nav className="flex items-center">
          <TabButton id="network" label="Network" />
          <TabButton id="route" label="Route Optimizer" />
          <TabButton id="fx" label="FX Risk" />
          <TabButton id="liquidity" label="Liquidity" />
          <TabButton id="stress" label="Stress Testing" />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-base">search</span>
          <input
            className="h-8 w-56 rounded-lg border border-border-dark bg-bg-dark pl-9 text-xs text-slate-100 focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-slate-500"
            placeholder="Search corridors or nodes..."
            type="text"
          />
        </div>
        <div className="flex h-8 items-center gap-2 rounded-lg bg-bg-dark px-3 text-xs font-mono text-slate-400 border border-border-dark">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>{time || "UTC --:--:--"}</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <span className="material-symbols-outlined text-primary text-base">account_balance</span>
        </div>
      </div>
    </header>
  );
}
