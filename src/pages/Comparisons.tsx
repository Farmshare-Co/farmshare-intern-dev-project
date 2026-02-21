import { useContext, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import { EAnimalSpecies as AnimalSpecies } from "../types";
import type { EAnimalSpecies } from "../types";
import { FarmContext } from "../context/FarmContext";
import SpeciesMixComparison from "../components/SpeciesMixComparison";
import BeforeAfterComparison from "../components/BeforeAfterComparison";

export default function Comparisons() {
  const {
    timePerAnimal,
    hourlyWage,
    selectedSpecies,
    volumes,
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  // State for comparison type
  const [comparisonType, setComparisonType] = useState<
    "speciesMix" | "beforeAfter"
  >("speciesMix");

  // State for species mix comparison
  const [scenarioASpecies, setScenarioASpecies] = useState<EAnimalSpecies[]>(
    []
  );
  const [scenarioAVolumes, setScenarioAVolumes] = useState<
    Record<EAnimalSpecies, string>
  >({} as Record<EAnimalSpecies, string>);
  const [scenarioBSpecies, setScenarioBSpecies] = useState<EAnimalSpecies[]>(
    []
  );
  const [scenarioBVolumes, setScenarioBVolumes] = useState<
    Record<EAnimalSpecies, string>
  >({} as Record<EAnimalSpecies, string>);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1, fontFamily: "roca" }}
          >
            {comparisonType === "speciesMix"
              ? "Species Mix Comparison"
              : "Before vs After Comparison"}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: "14px" }}
          >
            {comparisonType === "speciesMix"
              ? "Compare different species combinations to optimize profitability"
              : "See the financial impact of using FarmShare platform"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={() => setComparisonType("speciesMix")}
            sx={{
              backgroundColor: "farmGreen.main",
              color: "#fff",
              paddingX: 3,
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              opacity: comparisonType === "speciesMix" ? 1 : 0.6,
              "&:hover": {
                backgroundColor: "farmGreen.main",
                boxShadow: "none",
                opacity: 1,
              },
            }}
          >
            Species Mix
          </Button>
          <Button
            variant="contained"
            onClick={() => setComparisonType("beforeAfter")}
            sx={{
              backgroundColor: "farmOrange.main",
              color: "#fff",
              paddingX: 3,
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              opacity: comparisonType === "beforeAfter" ? 1 : 0.6,
              "&:hover": {
                backgroundColor: "farmOrange.main",
                boxShadow: "none",
                opacity: 1,
              },
            }}
          >
            Before/After
          </Button>
        </Box>
      </Box>

      {comparisonType === "speciesMix" && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", gap: 3 }}>
          {/* Scenario A */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              border: "2px solid #e0e0e0",
              borderColor: "farmGreen.light",
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "farmGreen.main",
                fontFamily: "roca",
                mb: "15px",
              }}
            >
              Species A
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Species</InputLabel>
              <Select
                multiple
                value={scenarioASpecies}
                onChange={(e) => {
                  const value = e.target.value;
                  const species =
                    typeof value === "string" ? value.split(",") : value;
                  setScenarioASpecies(species as EAnimalSpecies[]);
                }}
                input={<OutlinedInput label="Select Species" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {Object.values(AnimalSpecies).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {scenarioASpecies.map((species) => (
              <TextField
                key={species}
                fullWidth
                label={`${
                  species.charAt(0).toUpperCase() + species.slice(1)
                } Volume (lbs)`}
                type="number"
                value={scenarioAVolumes[species] || ""}
                onChange={(e) =>
                  setScenarioAVolumes((prev) => ({
                    ...prev,
                    [species]: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
                slotProps={{
                  htmlInput: { min: 0 },
                }}
              />
            ))}
          </Box>

          {/* Scenario B */}
          <Box
            sx={{
              flex: 1,
              p: 3,
              border: "2px solid",
              borderColor: "farmOrange.light",
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "farmOrange.main", fontFamily: "roca", mb: "15px" }}
            >
              Species B
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Species</InputLabel>
              <Select
                multiple
                value={scenarioBSpecies}
                onChange={(e) => {
                  const value = e.target.value;
                  const species =
                    typeof value === "string" ? value.split(",") : value;
                  setScenarioBSpecies(species as EAnimalSpecies[]);
                }}
                input={<OutlinedInput label="Select Species" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {Object.values(AnimalSpecies).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {scenarioBSpecies.map((species) => (
              <TextField
                key={species}
                fullWidth
                label={`${
                  species.charAt(0).toUpperCase() + species.slice(1)
                } Volume (lbs)`}
                type="number"
                value={scenarioBVolumes[species] || ""}
                onChange={(e) =>
                  setScenarioBVolumes((prev) => ({
                    ...prev,
                    [species]: e.target.value,
                  }))
                }
                sx={{ mb: 2 }}
                slotProps={{
                  htmlInput: { min: 0 },
                }}
              />
            ))}
          </Box>
        </Box>

        <SpeciesMixComparison
          scenarioA={{
            name: "Species A",
            selectedSpecies: scenarioASpecies,
            volumes: scenarioAVolumes,
            timePerAnimal,
            hourlyWage,
          }}
          scenarioB={{
            name: "Species B",
            selectedSpecies: scenarioBSpecies,
            volumes: scenarioBVolumes,
            timePerAnimal,
            hourlyWage,
          }}
        />
      </Box>
      )}

      {comparisonType === "beforeAfter" && (
        <BeforeAfterComparison
          selectedSpecies={selectedSpecies}
          withPlatformSavings={calculateTotalAnnualSavings()}
          withPlatformCost={calculateTotalAnnualCost()}
          withPlatformBenefit={
            calculateTotalAnnualSavings() - calculateTotalAnnualCost()
          }
        />
      )}
    </Box>
  );
}
