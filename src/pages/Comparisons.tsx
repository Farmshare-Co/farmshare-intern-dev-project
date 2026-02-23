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
  IconButton,
  DialogContentText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { EAnimalSpecies as AnimalSpecies, SPECIES_EMOJIS } from "../types";
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
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  // State for comparison type
  const [comparisonType, setComparisonType] = useState<
    "speciesMix" | "beforeAfter"
  >("speciesMix");

  // State for advanced settings dialog
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  // State for clear dialog
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearTarget, setClearTarget] = useState<"A" | "B" | null>(null);

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

  const handleClearScenario = (scenario: "A" | "B") => {
    setClearTarget(scenario);
    setClearDialogOpen(true);
  };

  const confirmClear = () => {
    if (clearTarget === "A") {
      setScenarioASpecies([]);
      setScenarioAVolumes({} as Record<EAnimalSpecies, string>);
    } else if (clearTarget === "B") {
      setScenarioBSpecies([]);
      setScenarioBVolumes({} as Record<EAnimalSpecies, string>);
    }
    setClearDialogOpen(false);
    setClearTarget(null);
  };

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: "15px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "farmGreen.main",
                    fontFamily: "roca",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  Species A
                </Typography>
                <IconButton
                  onClick={() => handleClearScenario("A")}
                  size="small"
                  sx={{
                    color: "farmGreen.main",
                    "&:hover": {
                      backgroundColor: "rgba(1, 111, 53, 0.08)",
                    },
                  }}
                >
                  <ClearAllIcon />
                </IconButton>
              </Box>
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value.charAt(0).toUpperCase() + value.slice(1)}
                          onDelete={() => {
                            const newSpecies = selected.filter(
                              (spec) => spec !== value
                            );
                            if (selected === scenarioASpecies) {
                              setScenarioASpecies(
                                newSpecies as EAnimalSpecies[]
                              );
                            } else {
                              setScenarioBSpecies(
                                newSpecies as EAnimalSpecies[]
                              );
                            }
                          }}
                          deleteIcon={
                            <div
                              role="button"
                              aria-label="Remove"
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CancelIcon />
                            </div>
                          }
                          sx={{
                            backgroundColor: "farmGreen.main",
                            color: "#fff",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "farmGreen.main",
                              transform: "scale(1.02)",
                            },
                            "& .MuiChip-deleteIcon": {
                              color: "#fff",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                color: "#fff",
                                transform: "scale(1.2) rotate(90deg)",
                                opacity: 0.8,
                              },
                              "&:active": {
                                transform: "scale(0.9) rotate(90deg)",
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(AnimalSpecies).map((s) => {
                    const isSelected = scenarioASpecies.includes(s);
                    return (
                      <MenuItem
                        key={s}
                        value={s}
                        sx={{
                          py: 1.5,
                          px: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          transition: "all 0.2s ease",
                          borderLeft: "3px solid transparent",
                          "&:hover": {
                            backgroundColor: "rgba(1, 111, 53, 0.08)",
                            transform: "translateX(4px)",
                            borderLeftColor: "farmOrange.main",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(1, 111, 53, 0.12)",
                            borderLeftColor: "farmGreen.main",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "rgba(1, 111, 53, 0.16)",
                              transform: "translateX(4px)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "1.5rem",
                            lineHeight: 1,
                            transition: "transform 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                        >
                          {SPECIES_EMOJIS[s]}
                        </Box>
                        <Box
                          sx={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Box>
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              color: "farmGreen.main",
                              fontSize: "1.2rem",
                              animation: "checkPop 0.3s ease",
                              "@keyframes checkPop": {
                                "0%": {
                                  transform: "scale(0)",
                                },
                                "50%": {
                                  transform: "scale(1.2)",
                                },
                                "100%": {
                                  transform: "scale(1)",
                                },
                              },
                            }}
                          />
                        )}
                      </MenuItem>
                    );
                  })}
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: "15px",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "farmOrange.main",
                    fontFamily: "roca",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  Species B
                </Typography>
                <IconButton
                  onClick={() => handleClearScenario("B")}
                  size="small"
                  sx={{
                    color: "farmOrange.main",
                    "&:hover": {
                      backgroundColor: "rgba(255, 124, 1, 0.08)",
                    },
                  }}
                >
                  <ClearAllIcon />
                </IconButton>
              </Box>
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value.charAt(0).toUpperCase() + value.slice(1)}
                          onDelete={() => {
                            const newSpecies = selected.filter(
                              (spec) => spec !== value
                            );
                            if (selected === scenarioASpecies) {
                              setScenarioASpecies(
                                newSpecies as EAnimalSpecies[]
                              );
                            } else {
                              setScenarioBSpecies(
                                newSpecies as EAnimalSpecies[]
                              );
                            }
                          }}
                          deleteIcon={
                            <div
                              role="button"
                              aria-label="Remove"
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CancelIcon />
                            </div>
                          }
                          sx={{
                            backgroundColor: "farmGreen.main",
                            color: "#fff",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: "farmGreen.main",
                              transform: "scale(1.02)",
                            },
                            "& .MuiChip-deleteIcon": {
                              color: "#fff",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                color: "#fff",
                                transform: "scale(1.2) rotate(90deg)",
                                opacity: 0.8,
                              },
                              "&:active": {
                                transform: "scale(0.9) rotate(90deg)",
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(AnimalSpecies).map((s) => {
                    const isSelected = scenarioBSpecies.includes(s);
                    return (
                      <MenuItem
                        key={s}
                        value={s}
                        sx={{
                          py: 1.5,
                          px: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          transition: "all 0.2s ease",
                          borderLeft: "3px solid transparent",
                          "&:hover": {
                            backgroundColor: "rgba(1, 111, 53, 0.08)",
                            transform: "translateX(4px)",
                            borderLeftColor: "farmOrange.main",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(1, 111, 53, 0.12)",
                            borderLeftColor: "farmGreen.main",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "rgba(1, 111, 53, 0.16)",
                              transform: "translateX(4px)",
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "1.5rem",
                            lineHeight: 1,
                            transition: "transform 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                        >
                          {SPECIES_EMOJIS[s]}
                        </Box>
                        <Box
                          sx={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Box>
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              color: "farmGreen.main",
                              fontSize: "1.2rem",
                              animation: "checkPop 0.3s ease",
                              "@keyframes checkPop": {
                                "0%": {
                                  transform: "scale(0)",
                                },
                                "50%": {
                                  transform: "scale(1.2)",
                                },
                                "100%": {
                                  transform: "scale(1)",
                                },
                              },
                            }}
                          />
                        )}
                      </MenuItem>
                    );
                  })}
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

      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "roca" }}>
          Clear Species {clearTarget}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "14px", fontWeight: 500 }}>
            Are you sure you want to clear all selected species and volume data
            for Species {clearTarget}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClearDialogOpen(false)}
            sx={{
              color: "farmGreen.main",
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: "0.875rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmClear}
            color="error"
            variant="contained"
            sx={{
              color: "#fff",
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: "0.875rem",
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
