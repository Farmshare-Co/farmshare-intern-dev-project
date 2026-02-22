import { useState } from "react";

interface AnnualSummaryProps {
  totalVolume: number;
  totalSavings: number;
  totalCost: number;
}

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtInt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function AnnualSummary({
  totalVolume,
  totalSavings,
  totalCost,
}: AnnualSummaryProps) {
  const [tab, setTab] = useState<"annual" | "monthly">("annual");

  const annual = { volume: totalVolume, savings: totalSavings, cost: totalCost, net: totalSavings - totalCost };
  const monthly = { volume: totalVolume / 12, savings: totalSavings / 12, cost: totalCost / 12, net: (totalSavings - totalCost) / 12 };
  const d = tab === "annual" ? annual : monthly;
  const netNeg = d.net < 0;

  return (
    <div className="summary">
      <div className="summary__header">
        <p className="summary__title">Results</p>
        <div className="summary__tabs">
          <button
            className={`summary__tab${tab === "annual" ? " summary__tab--active" : ""}`}
            onClick={() => setTab("annual")}
          >
            Annual
          </button>
          <button
            className={`summary__tab${tab === "monthly" ? " summary__tab--active" : ""}`}
            onClick={() => setTab("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="summary__hero">
        <p className="summary__hero-label">Net Benefit</p>
        <p className={`summary__hero-value${netNeg ? " summary__hero-value--neg" : ""}`}>
          {netNeg ? "−" : "+"}${fmt(Math.abs(d.net))}
        </p>
      </div>

      <div className="summary__stat-grid">
        <div className="summary__stat summary__stat--savings">
          <p className="summary__stat-label">Labor Savings</p>
          <p className="summary__stat-value">+${fmt(d.savings)}</p>
        </div>
        <div className="summary__stat summary__stat--cost">
          <p className="summary__stat-label">Platform Cost</p>
          <p className="summary__stat-value">−${fmt(d.cost)}</p>
        </div>
      </div>

      <div className="summary__volume">
        <span className="summary__volume-label">
          {tab === "annual" ? "Total Annual Volume" : "Avg Monthly Volume"}
        </span>
        <span className="summary__volume-value">{fmtInt(d.volume)} lbs</span>
      </div>
    </div>
  );
}
