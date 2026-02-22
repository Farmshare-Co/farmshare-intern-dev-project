import type { CalculatorInputs } from "../types";
import type { ProjectionResult } from "./projection";

const toCsvCell = (value: string): string => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

const formatNumber = (value: number): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const createProjectionCsv = (
  projection: ProjectionResult,
  inputs: CalculatorInputs,
): string => {
  const lines: string[] = [];

  lines.push("Farmshare Value Calculator Export");
  lines.push(`Generated At,${toCsvCell(new Date().toISOString())}`);
  lines.push("");
  lines.push("Assumptions");
  lines.push(`Time Savings per Animal (minutes),${toCsvCell(inputs.timePerAnimal)}`);
  lines.push(`Average Hourly Wage ($),${toCsvCell(inputs.hourlyWage)}`);
  lines.push("");
  lines.push("Annual Totals");
  lines.push(`Annual Volume (lbs),${formatNumber(projection.totals.annualVolume)}`);
  lines.push(`Annual Savings ($),${formatNumber(projection.totals.annualSavings)}`);
  lines.push(`Annual Cost ($),${formatNumber(projection.totals.annualCost)}`);
  lines.push(`Annual Net Benefit ($),${formatNumber(projection.totals.annualNetBenefit)}`);
  lines.push("");
  lines.push("Monthly Totals");
  lines.push(`Monthly Volume (lbs),${formatNumber(projection.totals.monthlyVolume)}`);
  lines.push(`Monthly Savings ($),${formatNumber(projection.totals.monthlySavings)}`);
  lines.push(`Monthly Cost ($),${formatNumber(projection.totals.monthlyCost)}`);
  lines.push(`Monthly Net Benefit ($),${formatNumber(projection.totals.monthlyNetBenefit)}`);
  lines.push("");
  lines.push("Species Breakdown");
  lines.push([
    "Species",
    "Annual Heads",
    "Annual Volume (lbs)",
    "Annual Savings ($)",
    "Annual Cost ($)",
    "Annual Net Benefit ($)",
    "Monthly Volume (lbs)",
    "Monthly Savings ($)",
    "Monthly Cost ($)",
    "Monthly Net Benefit ($)",
  ].join(","));

  for (const row of projection.rows) {
    lines.push([
      toCsvCell(row.species),
      formatNumber(row.annualHeads),
      formatNumber(row.annualVolume),
      formatNumber(row.annualSavings),
      formatNumber(row.annualCost),
      formatNumber(row.annualNetBenefit),
      formatNumber(row.monthlyVolume),
      formatNumber(row.monthlySavings),
      formatNumber(row.monthlyCost),
      formatNumber(row.monthlyNetBenefit),
    ].join(","));
  }

  return lines.join("\n");
};

export const downloadCsv = (fileName: string, content: string): void => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.style.display = "none";

  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
