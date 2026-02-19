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
}

export const exportCSV = ({
  selectedSpecies,
  volumes,
  timePerAnimal,
  hourlyWage,
  getTotalVolume,
  calculateTotalAnnualSavings,
  calculateTotalAnnualCost,
}: ExportCSVParams) => {
  const rows = [
    ["Meat Processor Annual Projections"],
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
    const savings = calculateLaborValue(
      heads,
      parseFloat(timePerAnimal),
      parseFloat(hourlyWage)
    );
    const cost = volume * COST_PER_LB;
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

  rows.push([]);
  rows.push([
    "TOTALS",
    getTotalVolume().toString(),
    "",
    "",
    calculateTotalAnnualSavings().toFixed(2),
    calculateTotalAnnualCost().toFixed(2),
    (calculateTotalAnnualSavings() - calculateTotalAnnualCost()).toFixed(2),
  ]);

  const csvContent = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "annual_projections.csv";
  a.click();
  URL.revokeObjectURL(url);
};
