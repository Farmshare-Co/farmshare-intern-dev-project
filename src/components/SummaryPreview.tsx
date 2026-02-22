import { useState } from "react";

interface SummaryPreviewProps {
  totalVolume: number;
  totalSavings: number;
  totalCost: number;
  label?: string;
}

const fmt = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtInt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function SummaryPreview({
  totalVolume,
  totalSavings,
  totalCost,
  label = "Live Preview",
}: SummaryPreviewProps) {
  const [tab, setTab] = useState<"annual" | "monthly">("annual");

  const annual = {
    volume: totalVolume,
    savings: totalSavings,
    cost: totalCost,
    net: totalSavings - totalCost,
  };
  const monthly = {
    volume: totalVolume / 12,
    savings: totalSavings / 12,
    cost: totalCost / 12,
    net: (totalSavings - totalCost) / 12,
  };
  const d = tab === "annual" ? annual : monthly;
  const netNeg = d.net < 0;
  const hasData = totalVolume > 0 || totalSavings > 0;

  return (
    <div className="preview">
      {/* Header */}
      <div className="summary__header">
        <span className="summary__title">{label}</span>
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
        <p className={`summary__hero-value${netNeg ? " summary__hero-value--neg" : ""}${!hasData ? " summary__hero-value--empty" : ""}`}>
          {hasData ? `${netNeg ? "−" : "+"}$${fmt(Math.abs(d.net))}` : "—"}
        </p>
      </div>
 
      <div className="preview__rows">
        <div className="preview__row">
          <span className="preview__row-label">Labor Savings</span>
          <span className="preview__row-value preview__row-value--savings">
            {hasData ? `+$${fmt(d.savings)}` : "—"}
          </span>
        </div>
        <div className="preview__row">
          <span className="preview__row-label">Platform Cost</span>
          <span className="preview__row-value preview__row-value--cost">
            {hasData ? `−$${fmt(d.cost)}` : "—"}
          </span>
        </div>
        <div className="preview__row preview__row--volume">
          <span className="preview__row-label">Volume</span>
          <span className="preview__row-value">
            {hasData ? `${fmtInt(d.volume)} lbs` : "—"}
          </span>
        </div>
      </div>

      {!hasData && (
        <p className="preview__empty">
          Select species &amp; enter volumes above to see your estimate.
        </p>
      )}
    </div>
  );
}
