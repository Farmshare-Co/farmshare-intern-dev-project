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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { EAnimalSpecies as AnimalSpecies } from "../types";
import type { EAnimalSpecies } from "../types";
import { FarmContext } from "../context/FarmContext";
import SpeciesMixComparison from "../components/SpeciesMixComparison";
import BeforeAfterComparison from "../components/BeforeAfterComparison";
import Empty from "../components/Empty";

export default function Comparisons() {
  const {
    timePerAnimal,
    setTimePerAnimal,
    hourlyWage,
    setHourlyWage,
    selectedSpecies,
    volumes,
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  // State for comparison type
  const [comparisonType, setComparisonType] = useState<
    "speciesMix" | "beforeAfter"
  >("speciesMix");

  // State for advanced settings dialog
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 1,
              fontFamily: "roca",
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
            }}
          >
            {comparisonType === "speciesMix"
              ? "Species Mix Comparison"
              : "Before vs After Comparison"}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            {comparisonType === "speciesMix"
              ? "Compare different species combinations to optimize profitability"
              : "See the financial impact of using FarmShare platform"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => setComparisonType("speciesMix")}
            sx={{
              backgroundColor: "farmGreen.main",
              color: "#fff",
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
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
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
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
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Scenario A */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, sm: 3 },
                border: "2px solid #e0e0e0",
                borderColor: "farmGreen.light",
                borderRadius: { xs: 2, sm: 3 },
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                transition: "all 0.2s ease",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "farmGreen.main",
                  fontFamily: "roca",
                  mb: "15px",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
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
                p: { xs: 2, sm: 3 },
                border: "2px solid",
                borderColor: "farmOrange.light",
                borderRadius: { xs: 2, sm: 3 },
                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                transition: "all 0.2s ease",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "farmOrange.main",
                  fontFamily: "roca",
                  mb: "15px",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
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
            onSettingsClick={() => setAdvancedSettingsOpen(true)}
          />
        </Box>
      )}

      {comparisonType === "beforeAfter" &&
        (selectedSpecies.length === 0 ? (
          <Empty
            heading="No comparisons to display"
            description="In order for you to see the comparisons, please head to the Calculator page and select atleast one species."
            btnLink="calculator"
            btnText="Calculator Page"
          />
        ) : (
          <BeforeAfterComparison
            selectedSpecies={selectedSpecies}
            withPlatformSavings={calculateTotalAnnualSavings()}
            withPlatformCost={calculateTotalAnnualCost()}
            withPlatformBenefit={
              calculateTotalAnnualSavings() - calculateTotalAnnualCost()
            }
          />
        ))}

      <Dialog
        open={advancedSettingsOpen}
        onClose={() => setAdvancedSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "roca" }} variant="h5">
          Advanced Settings
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, mt: 2, flexDirection: "row" }}>
            <TextField
              fullWidth
              label="Time Savings per Animal (minutes)"
              type="number"
              value={timePerAnimal}
              onChange={(e) => setTimePerAnimal(e.target.value)}
              slotProps={{
                htmlInput: { min: 1, max: 480 },
              }}
            />
            <TextField
              fullWidth
              label="Average Hourly Wage ($)"
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              slotProps={{
                htmlInput: { min: 1, max: 200 },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdvancedSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
