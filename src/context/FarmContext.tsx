import React, { createContext, useState } from "react";
import { AVG_HANGING_WEIGHTS, type EAnimalSpecies } from "../types";
import { calculateHeads, calculateLaborValue } from "../utils/calculations";
import { COST_PER_LB } from "../utils/statics";

interface FarmContextType {
  selectedSpecies: EAnimalSpecies[];
  setSelectedSpecies: React.Dispatch<React.SetStateAction<EAnimalSpecies[]>>;
  volumes: Record<EAnimalSpecies, string>;
  setVolumes: React.Dispatch<
    React.SetStateAction<Record<EAnimalSpecies, string>>
  >;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  timePerAnimal: string;
  setTimePerAnimal: React.Dispatch<React.SetStateAction<string>>;
  hourlyWage: string;
  setHourlyWage: React.Dispatch<React.SetStateAction<string>>;
  getTotalVolume: () => number;
  calculateTotalAnnualSavings: () => number;
  calculateTotalAnnualCost: () => number;
}

export const FarmContext = createContext<FarmContextType>(
  {} as FarmContextType
);

const FarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<EAnimalSpecies[]>([]);
  const [volumes, setVolumes] = useState<Record<EAnimalSpecies, string>>(
    {} as Record<EAnimalSpecies, string>
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timePerAnimal, setTimePerAnimal] = useState("45"); // minutes
  const [hourlyWage, setHourlyWage] = useState("25"); // dollars

  const getTotalVolume = () => {
    return selectedSpecies.reduce((total, species) => {
      return total + parseFloat(volumes[species] || "0");
    }, 0);
  };

  const calculateTotalAnnualSavings = () => {
    return selectedSpecies.reduce((total, species) => {
      const volume = parseFloat(volumes[species] || "0");
      if (volume > 0) {
        const avgWeight = AVG_HANGING_WEIGHTS[species];
        const heads = calculateHeads(volume, avgWeight);
        const savings = calculateLaborValue(
          heads,
          parseFloat(timePerAnimal),
          parseFloat(hourlyWage)
        );
        return total + savings;
      }
      return total;
    }, 0);
  };

  const calculateTotalAnnualCost = () => {
    return selectedSpecies.reduce((total, species) => {
      const volume = parseFloat(volumes[species] || "0");
      return total + volume * COST_PER_LB;
    }, 0);
  };

  return (
    <FarmContext.Provider
      value={{
        selectedSpecies,
        setSelectedSpecies,
        volumes,
        setVolumes,
        showAdvanced,
        setShowAdvanced,
        timePerAnimal,
        setTimePerAnimal,
        hourlyWage,
        setHourlyWage,
        getTotalVolume,
        calculateTotalAnnualSavings,
        calculateTotalAnnualCost,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export default FarmProvider;
