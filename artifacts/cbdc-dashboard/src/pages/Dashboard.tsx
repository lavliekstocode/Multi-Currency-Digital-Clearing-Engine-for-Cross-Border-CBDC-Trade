import { useState } from "react";
import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import MetricsBar from "../components/MetricsBar";
import NetworkGraph from "../components/NetworkGraph";
import RouteOptimizer from "../components/RouteOptimizer";
import FXRiskHeatmap from "../components/FXRiskHeatmap";
import LiquidityPanel from "../components/LiquidityPanel";
import StressTesting from "../components/StressTesting";

export type TabType = "network" | "route" | "fx" | "liquidity" | "stress";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("network");
  
  // Weights state
  const [weights, setWeights] = useState({
    alpha: 0.35,
    beta: 0.25,
    gamma: 0.20,
    delta: 0.20
  });

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bg-dark text-slate-100 font-display antialiased">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar weights={weights} onWeightsChange={setWeights} />
        <main className="flex-1 overflow-y-auto bg-bg-dark flex flex-col">
          <MetricsBar />
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "network" && <NetworkGraph />}
            {activeTab === "route" && <RouteOptimizer weights={weights} />}
            {activeTab === "fx" && <FXRiskHeatmap />}
            {activeTab === "liquidity" && <LiquidityPanel />}
            {activeTab === "stress" && <StressTesting />}
          </div>
        </main>
      </div>
    </div>
  );
}
