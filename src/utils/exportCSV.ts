import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads, calculateLaborValue } from "./calculations";
import { COST_PER_LB } from "./statics";

interface ExportCSVParams {
  selectedSpecies: EAnimalSpecies[];
  volumes: Record<EAnimalSpecies, string>;
  timePerAnimal: string;
  hourlyWage: string;
  getTotalVolume: () => number;
  calculateTotalAnnualSavings: () => number;
  calculateTotalAnnualCost: () => number;
  viewMode: "annual" | "monthly";
}

export const exportCSV = ({
  selectedSpecies,
  volumes,
  timePerAnimal,
  hourlyWage,
  getTotalVolume,
  calculateTotalAnnualSavings,
  calculateTotalAnnualCost,
  viewMode,
}: ExportCSVParams) => {
  const periodLabel = viewMode === "annual" ? "Annual" : "Monthly";
  const rows = [
    [`Meat Processor ${periodLabel} Projections`],
    [],
    [
      "Species",
      "Total Weight (lbs)",
      "Avg Weight (lbs)",
      "Heads",
      "Labor Savings ($)",
      "Platform Cost ($)",
      "Net Benefit ($)",
    ],
  ];

  selectedSpecies.forEach((species) => {
    const volume = parseFloat(volumes[species] || "0");
    const avgWeight = AVG_HANGING_WEIGHTS[species];
    const heads = calculateHeads(volume, avgWeight);
    const annualSavings = calculateLaborValue(
      heads,
      parseFloat(timePerAnimal),
      parseFloat(hourlyWage)
    );
    const annualCost = volume * COST_PER_LB;
    const savings = viewMode === "monthly" ? annualSavings / 12 : annualSavings;
    const cost = viewMode === "monthly" ? annualCost / 12 : annualCost;
    const net = savings - cost;
    rows.push([
      species.charAt(0).toUpperCase() + species.slice(1),
      volume.toString(),
      avgWeight.toString(),
      heads.toString(),
      savings.toFixed(2),
      cost.toFixed(2),
      net.toFixed(2),
    ]);
  });

  const annualSavings = calculateTotalAnnualSavings();
  const annualCost = calculateTotalAnnualCost();
  const totalSavings = viewMode === "monthly" ? annualSavings / 12 : annualSavings;
  const totalCost = viewMode === "monthly" ? annualCost / 12 : annualCost;

  rows.push([]);
  rows.push([
    "TOTALS",
    getTotalVolume().toString(),
    "",
    "",
    totalSavings.toFixed(2),
    totalCost.toFixed(2),
    (totalSavings - totalCost).toFixed(2),
  ]);

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${viewMode}_projections.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
