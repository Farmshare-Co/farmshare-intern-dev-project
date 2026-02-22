import type { EAnimalSpecies } from "../types";

export interface SpeciesPreset {
  id: string;
  label: string;
  species: EAnimalSpecies[];
  volumes: Partial<Record<EAnimalSpecies, string>>;
}
