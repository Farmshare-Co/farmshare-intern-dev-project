import { AVG_HANGING_WEIGHTS } from "../types";
import type { CalculatorInputs, EAnimalSpecies } from "../types";
import { COST_PER_LB } from "../constants/calculator";
import { calculateHeads, calculateLaborValue } from "./calculations";
import { parseNonNegativeNumber, validateInputs } from "./validation";

export interface ProjectionRow {
  species: EAnimalSpecies;
  annualHeads: number;
  annualVolume: number;
  annualSavings: number;
  annualCost: number;
  annualNetBenefit: number;
  monthlyVolume: number;
  monthlySavings: number;
  monthlyCost: number;
  monthlyNetBenefit: number;
}

export interface ProjectionTotals {
  annualVolume: number;
  annualSavings: number;
  annualCost: number;
  annualNetBenefit: number;
  monthlyVolume: number;
  monthlySavings: number;
  monthlyCost: number;
  monthlyNetBenefit: number;
}

export interface ProjectionResult {
  rows: ProjectionRow[];
  totals: ProjectionTotals;
}

const EMPTY_TOTALS: ProjectionTotals = {
  annualVolume: 0,
  annualSavings: 0,
  annualCost: 0,
  annualNetBenefit: 0,
  monthlyVolume: 0,
  monthlySavings: 0,
  monthlyCost: 0,
  monthlyNetBenefit: 0,
};

export const calculateProjection = (inputs: CalculatorInputs): ProjectionResult => {
  const validationErrors = validateInputs(inputs);
  const parsedTimePerAnimal = validationErrors.timePerAnimal
    ? 0
    : parseNonNegativeNumber(inputs.timePerAnimal);
  const parsedHourlyWage = validationErrors.hourlyWage
    ? 0
    : parseNonNegativeNumber(inputs.hourlyWage);

  const rows = inputs.selectedSpecies.map((species) => {
    const annualVolume = validationErrors.volumes[species]
      ? 0
      : parseNonNegativeNumber(inputs.volumes[species] || "");
    const annualHeads =
      annualVolume > 0
        ? calculateHeads(annualVolume, AVG_HANGING_WEIGHTS[species])
        : 0;
    const annualSavings = calculateLaborValue(
      annualHeads,
      parsedTimePerAnimal,
      parsedHourlyWage,
    );
    const annualCost = annualVolume * COST_PER_LB;
    const annualNetBenefit = annualSavings - annualCost;

    return {
      species,
      annualHeads,
      annualVolume,
      annualSavings,
      annualCost,
      annualNetBenefit,
      monthlyVolume: annualVolume / 12,
      monthlySavings: annualSavings / 12,
      monthlyCost: annualCost / 12,
      monthlyNetBenefit: annualNetBenefit / 12,
    };
  });

  const totals = rows.reduce(
    (acc, row) => ({
      annualVolume: acc.annualVolume + row.annualVolume,
      annualSavings: acc.annualSavings + row.annualSavings,
      annualCost: acc.annualCost + row.annualCost,
      annualNetBenefit: acc.annualNetBenefit + row.annualNetBenefit,
      monthlyVolume: acc.monthlyVolume + row.monthlyVolume,
      monthlySavings: acc.monthlySavings + row.monthlySavings,
      monthlyCost: acc.monthlyCost + row.monthlyCost,
      monthlyNetBenefit: acc.monthlyNetBenefit + row.monthlyNetBenefit,
    }),
    EMPTY_TOTALS,
  );

  return { rows, totals };
};
