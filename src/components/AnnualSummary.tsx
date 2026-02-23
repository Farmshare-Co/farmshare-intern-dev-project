import { useState } from "react";
import { EAnimalSpecies, type BreakdownRow } from "./../types";
import { fmt, fmtInt, capitalize } from "./../utils/formatters";
import { exportCSV, exportPDF, exportComparisonCSV, exportComparisonPDF, type ExportRow } from "./../utils/export";

function toExportRows(rows: BreakdownRow[]): ExportRow[] {
  return rows.map((r) => ({ ...r, net: r.savings - r.cost }));
}

interface AnnualSummaryProps {
  totalVolume: number;
  totalSavings: number;
  totalCost: number;
  breakdown: BreakdownRow[];
  comparisonMode?: boolean;
  totalVolumeB?: number;
  totalSavingsB?: number;
  totalCostB?: number;
  breakdownB?: BreakdownRow[];
  labelA?: string;
  labelB?: string;
}

function BreakdownTable({
  rows,
  period,
  compact = false,
}: {
  rows: BreakdownRow[];
  period: "annual" | "monthly";
  compact?: boolean;
}) {
  const m = period === "monthly" ? 1 / 12 : 1;

  if (rows.length === 0) {
    return <p className="summary__bd-empty">No species selected.</p>;
  }

  const totals = rows.reduce(
    (a, r) => ({ volume: a.volume + r.volume, heads: a.heads + r.heads, savings: a.savings + r.savings, cost: a.cost + r.cost }),
    { volume: 0, heads: 0, savings: 0, cost: 0 },
  );

  const rowClass = `summary__bd-row${compact ? " summary__bd-row--compact" : ""}`;

  return (
    <div className="summary__bd-table">
      <div className={`${rowClass} summary__bd-row--head`}>
        <span>Species</span>
        {!compact && <span>{period === "annual" ? "Volume" : "Mo. Vol."}</span>}
        <span>Heads</span>
        <span>Savings</span>
        <span>Cost</span>
      </div>

      {rows.map((r) => (
        <div key={r.species} className={rowClass}>
          <span className="summary__bd-cell--label">{capitalize(EAnimalSpecies[r.species])}</span>
          {!compact && <span>{fmtInt(r.volume * m)} lbs</span>}
          <span className="summary__bd-cell--heads">{fmtInt(r.heads * m)} hd</span>
          <span className="summary__bd-cell--savings">+${fmt(r.savings * m)}</span>
          <span className="summary__bd-cell--cost">−${fmt(r.cost * m)}</span>
        </div>
      ))}

      {rows.length > 1 && (
        <div className={`${rowClass} summary__bd-row--total`}>
          <span className="summary__bd-cell--label">Total</span>
          {!compact && <span>{fmtInt(totals.volume * m)} lbs</span>}
          <span className="summary__bd-cell--heads">{fmtInt(totals.heads * m)} hd</span>
          <span className="summary__bd-cell--savings">+${fmt(totals.savings * m)}</span>
          <span className="summary__bd-cell--cost">−${fmt(totals.cost * m)}</span>
        </div>
      )}
    </div>
  );
}

export default function AnnualSummary({
  totalVolume,
  totalSavings,
  totalCost,
  breakdown,
  comparisonMode = false,
  totalVolumeB = 0,
  totalSavingsB = 0,
  totalCostB = 0,
  breakdownB = [],
  labelA = "Scenario A",
  labelB = "Scenario B",
}: AnnualSummaryProps) {
  const [tab, setTab] = useState<"annual" | "monthly">("annual");
  const m = tab === "monthly" ? 1 / 12 : 1;

  const netA = (totalSavings - totalCost) * m;
  const netB = (totalSavingsB - totalCostB) * m;

  const hasDataA = totalVolume > 0 || totalSavings > 0;
  const hasDataB = totalVolumeB > 0 || totalSavingsB > 0;

  const Tabs = () => (
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
  );

  if (comparisonMode) {
    return (
      <div className="summary">
        <div className="summary__header">
          <p className="summary__title">Results</p>
          <Tabs />
        </div>

        <div className="summary__cmp-cols">
          {/* Scenario A */}
          <div className="summary__cmp-col">
            <p className="summary__cmp-label">{labelA}</p>
            <div className="summary__cmp-hero">
              <p className="summary__hero-label">Net Benefit</p>
              <p className={`summary__cmp-hero-val${netA < 0 ? " summary__cmp-hero-val--neg" : ""}${!hasDataA ? " summary__hero-value--empty" : ""}`}>
                {hasDataA ? `${netA < 0 ? "−" : "+"}$${fmt(Math.abs(netA))}` : "—"}
              </p>
            </div>
            <div className="summary__stat-grid">
              <div className="summary__stat summary__stat--savings">
                <p className="summary__stat-label">Savings</p>
                <p className="summary__stat-value">{hasDataA ? `+$${fmt(totalSavings * m)}` : "—"}</p>
              </div>
              <div className="summary__stat summary__stat--cost">
                <p className="summary__stat-label">Cost</p>
                <p className="summary__stat-value">{hasDataA ? `−$${fmt(totalCost * m)}` : "—"}</p>
              </div>
            </div>
            <div className="summary__volume">
              <span className="summary__volume-label">{tab === "annual" ? "Annual Vol." : "Mo. Vol."}</span>
              <span className="summary__volume-value">{fmtInt(totalVolume * m)} lbs</span>
            </div>
          </div>

          <div className="summary__cmp-divider" />

          {/* Scenario B */}
          <div className="summary__cmp-col">
            <p className="summary__cmp-label">{labelB}</p>
            <div className="summary__cmp-hero">
              <p className="summary__hero-label">Net Benefit</p>
              <p className={`summary__cmp-hero-val${netB < 0 ? " summary__cmp-hero-val--neg" : ""}${!hasDataB ? " summary__hero-value--empty" : ""}`}>
                {hasDataB ? `${netB < 0 ? "−" : "+"}$${fmt(Math.abs(netB))}` : "—"}
              </p>
            </div>
            <div className="summary__stat-grid">
              <div className="summary__stat summary__stat--savings">
                <p className="summary__stat-label">Savings</p>
                <p className="summary__stat-value">{hasDataB ? `+$${fmt(totalSavingsB * m)}` : "—"}</p>
              </div>
              <div className="summary__stat summary__stat--cost">
                <p className="summary__stat-label">Cost</p>
                <p className="summary__stat-value">{hasDataB ? `−$${fmt(totalCostB * m)}` : "—"}</p>
              </div>
            </div>
            <div className="summary__volume">
              <span className="summary__volume-label">{tab === "annual" ? "Annual Vol." : "Mo. Vol."}</span>
              <span className="summary__volume-value">{fmtInt(totalVolumeB * m)} lbs</span>
            </div>
          </div>
        </div>

        {/* Comparison breakdown */}
        <div className="summary__bd">
          <p className="summary__bd-title">Calculation Breakdown</p>
          <div className="summary__cmp-bd-cols">
            <div>
              <p className="summary__bd-scenario-label">{labelA}</p>
              <BreakdownTable rows={breakdown} period={tab} compact />
            </div>
            <div className="summary__cmp-bd-divider" />
            <div>
              <p className="summary__bd-scenario-label">{labelB}</p>
              <BreakdownTable rows={breakdownB} period={tab} compact />
            </div>
          </div>
        </div>

        <div className="summary__export-actions">
          <button className="summary__export-btn" disabled={!hasDataA && !hasDataB} onClick={() => exportComparisonCSV(toExportRows(breakdown), labelA, toExportRows(breakdownB), labelB)}>Export CSV</button>
          <button className="summary__export-btn" disabled={!hasDataA && !hasDataB} onClick={() => exportComparisonPDF(toExportRows(breakdown), labelA, toExportRows(breakdownB), labelB)}>Export PDF</button>
        </div>
      </div>
    );
  }

  // Single mode
  return (
    <div className="summary">
      <div className="summary__header">
        <p className="summary__title">Results</p>
        <Tabs />
      </div>

      <div className="summary__hero">
        <p className="summary__hero-label">Net Benefit</p>
        <p className={`summary__hero-value${netA < 0 ? " summary__hero-value--neg" : ""}${!hasDataA ? " summary__hero-value--empty" : ""}`}>
          {hasDataA ? `${netA < 0 ? "−" : "+"}$${fmt(Math.abs(netA))}` : "—"}
        </p>
      </div>

      <div className="summary__stat-grid">
        <div className="summary__stat summary__stat--savings">
          <p className="summary__stat-label">Labor Savings</p>
          <p className="summary__stat-value">{hasDataA ? `+$${fmt(totalSavings * m)}` : "—"}</p>
        </div>
        <div className="summary__stat summary__stat--cost">
          <p className="summary__stat-label">Platform Cost</p>
          <p className="summary__stat-value">{hasDataA ? `−$${fmt(totalCost * m)}` : "—"}</p>
        </div>
      </div>

      <div className="summary__volume">
        <span className="summary__volume-label">
          {tab === "annual" ? "Total Annual Volume" : "Avg Monthly Volume"}
        </span>
        <span className="summary__volume-value">{fmtInt(totalVolume * m)} lbs</span>
      </div>

      {breakdown.length > 0 && (
        <div className="summary__bd">
          <p className="summary__bd-title">Calculation Breakdown</p>
          <BreakdownTable rows={breakdown} period={tab} />
        </div>
      )}

      <div className="summary__export-actions">
        <button className="summary__export-btn" disabled={!hasDataA} onClick={() => exportCSV(toExportRows(breakdown), labelA)}>Export CSV</button>
        <button className="summary__export-btn" disabled={!hasDataA} onClick={() => exportPDF(toExportRows(breakdown), labelA)}>Export PDF</button>
      </div>
    </div>
  );
}
