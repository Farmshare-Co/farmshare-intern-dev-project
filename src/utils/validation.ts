import type { CalculatorInputs, EAnimalSpecies } from "../types";
import {
  MAX_ANNUAL_VOLUME,
  MAX_HOURLY_WAGE,
  MAX_TIME_PER_ANIMAL_MINUTES,
} from "../constants/calculator";

export interface ValidationErrors {
  volumes: Partial<Record<EAnimalSpecies, string>>;
  timePerAnimal?: string;
  hourlyWage?: string;
}

const validateBoundedNumber = (
  value: string,
  label: string,
  max: number,
): string | undefined => {
  const normalized = value.trim();
  if (normalized === "") {
    return undefined;
  }

  const parsedValue = Number(normalized);
  if (!Number.isFinite(parsedValue)) {
    return `${label} must be a valid number.`;
  }

  if (parsedValue < 0) {
    return `${label} cannot be negative.`;
  }

  if (parsedValue > max) {
    return `${label} must be ${max.toLocaleString()} or less.`;
  }

  return undefined;
};

export const parseNonNegativeNumber = (value: string): number => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
};

export const validateInputs = (inputs: CalculatorInputs): ValidationErrors => {
  const volumeErrors: Partial<Record<EAnimalSpecies, string>> = {};

  for (const species of inputs.selectedSpecies) {
    const error = validateBoundedNumber(
      inputs.volumes[species] ?? "",
      "Annual volume",
      MAX_ANNUAL_VOLUME,
    );

    if (error) {
      volumeErrors[species] = error;
    }
  }

  return {
    volumes: volumeErrors,
    timePerAnimal: validateBoundedNumber(
      inputs.timePerAnimal,
      "Time savings per animal",
      MAX_TIME_PER_ANIMAL_MINUTES,
    ),
    hourlyWage: validateBoundedNumber(
      inputs.hourlyWage,
      "Hourly wage",
      MAX_HOURLY_WAGE,
    ),
  };
};

export const hasValidationErrors = (errors: ValidationErrors): boolean =>
  Boolean(
    errors.timePerAnimal ||
      errors.hourlyWage ||
      Object.keys(errors.volumes).length > 0,
  );
