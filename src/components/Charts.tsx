import { forwardRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { ExportRow } from "../utils/export";
import { fmt, fmtInt, capitalize } from "../utils/formatters";

interface SavingsCostChartProps {
  rows: ExportRow[];
  label?: string;
}

export const SavingsCostChart = forwardRef<HTMLDivElement, SavingsCostChartProps>(
  ({ rows, label }, ref) => {
    const data = rows.map((r) => ({
      name: capitalize(r.species),
      Savings: Math.round(r.savings),
      Cost: Math.round(r.cost),
    }));

    return (
      <div ref={ref} className="chart-card">
        <p className="chart-card__title">
          {label ? `${label} — ` : ""}Savings vs Cost
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v: number) => `$${fmtInt(v)}`}
              tick={{ fontSize: 10 }}
              width={70}
            />
            <Tooltip formatter={(v) => [`$${fmt(Number(v ?? 0))}`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Savings" fill="var(--fs-green-500)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Cost" fill="var(--fs-cost)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },
);

SavingsCostChart.displayName = "SavingsCostChart";

interface SummaryChartsProps {
  rows: ExportRow[];
  label?: string;
}

export const SummaryCharts = forwardRef<HTMLDivElement, SummaryChartsProps>(
  ({ rows, label }, ref) => {
    if (rows.length === 0) return null;
    return (
      <div ref={ref} className="chart-section">
        <SavingsCostChart rows={rows} label={label} />
      </div>
    );
  },
);

SummaryCharts.displayName = "SummaryCharts";
