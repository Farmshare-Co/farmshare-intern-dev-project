import jsPDF from "jspdf";
import type { EAnimalSpecies } from "./types";
import { AVG_HANGING_WEIGHTS } from "./types";
import { calculateHeads, calculateLaborValue } from "./calculations";
import {fmt, capitalize} from "./formatters";

const COST_PER_LB = 0.02;

export interface ExportRow {
  species: EAnimalSpecies;
  volume: number;
  heads: number;
  savings: number;
  cost: number;
  net: number;
}

export function buildExportRows(
  selectedSpecies: EAnimalSpecies[],
  volumes: Partial<Record<EAnimalSpecies, string>>,
  timePerAnimal: number,
  hourlyWage: number,
): ExportRow[] {
  return selectedSpecies.map((species) => {
    const volume = parseFloat(volumes[species] || "0");
    const heads = calculateHeads(volume, AVG_HANGING_WEIGHTS[species]);
    const savings = calculateLaborValue(heads, timePerAnimal, hourlyWage);
    const cost = volume * COST_PER_LB;
    return { species, volume, heads, savings, cost, net: savings - cost };
  });
}

export function exportCSV(
  rows: ExportRow[],
  scenarioName = "Farmshare Calculator",
): void {
  const header = [
    "Species",
    "Annual Volume (lbs)",
    "Est. Heads",
    "Annual Savings ($)",
    "Annual Cost ($)",
    "Net Benefit ($)",
  ].join(",");

  const dataRows = rows.map((r) =>
    [
      capitalize(r.species),
      r.volume,
      r.heads,
      r.savings.toFixed(2),
      r.cost.toFixed(2),
      r.net.toFixed(2),
    ].join(","),
  );

  const totals = rows.reduce(
    (acc, r) => ({
      volume: acc.volume + r.volume,
      heads: acc.heads + r.heads,
      savings: acc.savings + r.savings,
      cost: acc.cost + r.cost,
      net: acc.net + r.net,
    }),
    { volume: 0, heads: 0, savings: 0, cost: 0, net: 0 },
  );

  const totalRow = [
    "TOTAL",
    totals.volume,
    totals.heads,
    totals.savings.toFixed(2),
    totals.cost.toFixed(2),
    totals.net.toFixed(2),
  ].join(",");

  const csv = [header, ...dataRows, "", totalRow].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${scenarioName.replace(/\s+/g, "_")}_projections.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(
  rows: ExportRow[],
  scenarioName = "Farmshare Calculator",
): void {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(27, 61, 42); // --fs-green-900
  doc.text("Farmshare — Annual Projections Report", 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(90, 106, 101); // --text-muted
  doc.text(scenarioName, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

  const cols = ["Species", "Volume (lbs)", "Heads", "Savings", "Cost", "Net"];
  const colWidths = [30, 32, 20, 32, 28, 32];
  let y = 46;

  doc.setFontSize(9);
  doc.setFillColor(27, 61, 42);
  doc.rect(14, y - 5, 182, 7, "F");
  doc.setTextColor(255, 255, 255);

  let x = 14;
  cols.forEach((col, i) => {
    doc.text(col, x + 2, y);
    x += colWidths[i];
  });

  y += 6;

  doc.setTextColor(28, 37, 38);
  rows.forEach((row, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(240, 250, 244);
      doc.rect(14, y - 5, 182, 7, "F");
    }
    x = 14;
    const cells = [
      capitalize(row.species),
      row.volume.toLocaleString(),
      row.heads.toLocaleString(),
      `$${fmt(row.savings)}`,
      `$${fmt(row.cost)}`,
      `${row.net >= 0 ? "+" : "-"}$${fmt(Math.abs(row.net))}`,
    ];
    cells.forEach((cell, i) => {
      doc.text(cell, x + 2, y);
      x += colWidths[i];
    });
    y += 7;
  });

  const totals = rows.reduce(
    (acc, r) => ({
      volume: acc.volume + r.volume,
      heads: acc.heads + r.heads,
      savings: acc.savings + r.savings,
      cost: acc.cost + r.cost,
      net: acc.net + r.net,
    }),
    { volume: 0, heads: 0, savings: 0, cost: 0, net: 0 },
  );

  y += 2;
  doc.setFillColor(82, 183, 136);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  x = 14;
  const totalCells = [
    "TOTAL",
    totals.volume.toLocaleString(),
    totals.heads.toLocaleString(),
    `$${fmt(totals.savings)}`,
    `$${fmt(totals.cost)}`,
    `${totals.net >= 0 ? "+" : "-"}$${fmt(Math.abs(totals.net))}`,
  ];
  totalCells.forEach((cell, i) => {
    doc.text(cell, x + 2, y + 1);
    x += colWidths[i];
  });

  doc.save(`${scenarioName.replace(/\s+/g, "_")}_projections.pdf`);
}

function renderScenarioTable(
  doc: jsPDF,
  rows: ExportRow[],
  label: string,
  startY: number,
  cols: string[],
  colWidths: number[],
): number {
  let y = startY;
  doc.setFontSize(10);
  doc.setTextColor(27, 61, 42);
  doc.text(label, 14, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFillColor(27, 61, 42);
  doc.rect(14, y - 5, 182, 7, "F");
  doc.setTextColor(255, 255, 255);
  let x = 14;
  cols.forEach((col, i) => { doc.text(col, x + 2, y); x += colWidths[i]; });
  y += 6;

  doc.setTextColor(28, 37, 38);
  rows.forEach((row, idx) => {
    if (idx % 2 === 0) { doc.setFillColor(240, 250, 244); doc.rect(14, y - 5, 182, 7, "F"); }
    x = 14;
    const cells = [
      capitalize(row.species), row.volume.toLocaleString(), row.heads.toLocaleString(),
      `$${fmt(row.savings)}`, `$${fmt(row.cost)}`, `${row.net >= 0 ? "+" : "-"}$${fmt(Math.abs(row.net))}`,
    ];
    cells.forEach((cell, i) => { doc.text(cell, x + 2, y); x += colWidths[i]; });
    y += 7;
  });

  const totals = rows.reduce((acc, r) => ({
    volume: acc.volume + r.volume, heads: acc.heads + r.heads,
    savings: acc.savings + r.savings, cost: acc.cost + r.cost, net: acc.net + r.net,
  }), { volume: 0, heads: 0, savings: 0, cost: 0, net: 0 });

  y += 2;
  doc.setFillColor(40, 90, 120);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  x = 14;
  ["TOTAL", totals.volume.toLocaleString(), totals.heads.toLocaleString(),
    `$${fmt(totals.savings)}`, `$${fmt(totals.cost)}`, `${totals.net >= 0 ? "+" : "-"}$${fmt(Math.abs(totals.net))}`
  ].forEach((cell, i) => { doc.text(cell, x + 2, y + 1); x += colWidths[i]; });

  return y + 12;
}

export function exportComparisonCSV(
  rowsA: ExportRow[], labelA: string,
  rowsB: ExportRow[], labelB: string,
): void {
  const header = ["Scenario", "Species", "Annual Volume (lbs)", "Est. Heads", "Annual Savings ($)", "Annual Cost ($)", "Net Benefit ($)"].join(",");
  const toRows = (rows: ExportRow[], label: string) =>
    rows.map((r) => [label, capitalize(r.species), r.volume, r.heads, r.savings.toFixed(2), r.cost.toFixed(2), r.net.toFixed(2)].join(","));
  const csv = [header, ...toRows(rowsA, labelA), "", ...toRows(rowsB, labelB)].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${labelA}_vs_${labelB}_comparison.csv`.replace(/\s+/g, "_");
  a.click();
  URL.revokeObjectURL(url);
}

export function exportComparisonPDF(
  rowsA: ExportRow[], labelA: string,
  rowsB: ExportRow[], labelB: string,
): void {
  const doc = new jsPDF();
  const cols = ["Species", "Volume (lbs)", "Heads", "Savings", "Cost", "Net"];
  const colWidths = [30, 32, 20, 32, 28, 32];

  doc.setFontSize(18);
  doc.setTextColor(27, 61, 42);
  doc.text("Farmshare — Comparison Report", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(90, 106, 101);
  doc.text(`${labelA} vs ${labelB}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

  let y = 46;
  y = renderScenarioTable(doc, rowsA, labelA, y, cols, colWidths);
  if (y > 240) { doc.addPage(); y = 20; }
  renderScenarioTable(doc, rowsB, labelB, y, cols, colWidths);

  doc.save(`${labelA}_vs_${labelB}_comparison.pdf`.replace(/\s+/g, "_"));
}
