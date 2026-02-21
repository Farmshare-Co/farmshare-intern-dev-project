import { useContext, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Collapse,
  IconButton,
  OutlinedInput,
  Chip,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EAnimalSpecies } from "./types";
import { EAnimalSpecies as AnimalSpecies, AVG_HANGING_WEIGHTS } from "./types";
import { exportCSV } from "./utils/exportCSV";
import { exportPDF } from "./utils/exportPDF";
import "./App.css";
import { FarmContext } from "./context/FarmContext";
import SavingsChart from "./components/SavingsChart";
import BeforeAfterComparison from "./components/BeforeAfterComparison";
import SpeciesMixComparison from "./components/SpeciesMixComparison";

function App() {
  const {
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
  } = useContext(FarmContext);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  // custom presets state are loaded from localStorage
  interface CustomPreset {
    name: string;
    species: EAnimalSpecies[];
    volumes: Record<EAnimalSpecies, string>;
  }

  const getCustomPresets = (): CustomPreset[] => {
    const saved = localStorage.getItem("farmshare-custom-presets");
    return saved ? JSON.parse(saved) : [];
  };

  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(
    getCustomPresets()
  );

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

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    setVolumes((prev) => ({ ...prev, [species]: value }));
  };

  const hasEmptyVolumes = () => {
    return selectedSpecies.some(
      (species) => !volumes[species] || volumes[species].trim() === ""
    );
  };

  const handleValidationErrors = () => {
    // check for invalid volume
    const hasInvalidVolume = selectedSpecies.some((species) => {
      const volume = +volumes[species];
      return volume < 0 || volume > 10000000;
    });

    // check if hourly wage isn't valid
    const hasInvalidWage = +hourlyWage < 1 || +hourlyWage > 200;

    // check for invalid timeForAnimal
    const hasInvalidTime = +timePerAnimal < 1 || +timePerAnimal > 480;

    return hasInvalidVolume || hasInvalidWage || hasInvalidTime;
  };

  const handleClearAll = () => {
    setClearDialogOpen(true);
  };

  // preset config
  const presets = {
    none: { species: [], volumes: {} },
    beefFocused: {
      species: ["beef" as EAnimalSpecies],
      volumes: { beef: "10000" },
    },
    mixedOperation: {
      species: [
        "beef" as EAnimalSpecies,
        "lamb" as EAnimalSpecies,
        "hog" as EAnimalSpecies,
      ],
      volumes: { beef: "5000", lamb: "2000", hog: "1500" },
    },
    smallFarm: {
      species: ["lamb" as EAnimalSpecies, "goat" as EAnimalSpecies],
      volumes: { lamb: "500", goat: "300" },
    },
    largeCommercial: {
      species: [
        "beef" as EAnimalSpecies,
        "hog" as EAnimalSpecies,
        "veal" as EAnimalSpecies,
      ],
      volumes: { beef: "20000", hog: "15000", veal: "5000" },
    },
  };

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    // check if its custom preset (starts with "custom-")
    if (value.startsWith("custom-")) {
      const customPresetName = value.replace("custom-", "");
      const customPreset = customPresets.find(
        (p) => p.name === customPresetName
      );
      if (customPreset) {
        setSelectedSpecies(customPreset.species);
        setVolumes(customPreset.volumes);
        setSnackbar({
          open: true,
          message: `Preset "${customPreset.name}" applied successfully!`,
          severity: "success",
        });
      }
    } else {
      // handle default presets
      const presetKey = value as keyof typeof presets;
      if (presetKey && presetKey !== "none") {
        const preset = presets[presetKey];
        setSelectedSpecies(preset.species);
        setVolumes(preset.volumes as Record<EAnimalSpecies, string>);
        setSnackbar({
          open: true,
          message: "Preset applied successfully!",
          severity: "success",
        });
      }
    }
  };

  const handleSavePreset = () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before saving a preset.",
        severity: "error",
      });
      return;
    }

    if (!presetName.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a preset name.",
        severity: "error",
      });
      return;
    }

    // check if preset name already exists
    if (customPresets.some((p) => p.name === presetName.trim())) {
      setSnackbar({
        open: true,
        message: "A preset with this name already exists.",
        severity: "error",
      });
      return;
    }

    const newPreset: CustomPreset = {
      name: presetName.trim(),
      species: selectedSpecies,
      volumes: volumes,
    };

    const updatedPresets = [...customPresets, newPreset];
    setCustomPresets(updatedPresets);
    localStorage.setItem(
      "farmshare-custom-presets",
      JSON.stringify(updatedPresets)
    );

    setSnackbar({
      open: true,
      message: `Preset "${presetName.trim()}" saved successfully!`,
      severity: "success",
    });

    setSavePresetDialogOpen(false);
    setPresetName("");
  };

  const handleDeleteCustomPreset = (presetName: string) => {
    const updatedPresets = customPresets.filter((p) => p.name !== presetName);
    setCustomPresets(updatedPresets);
    localStorage.setItem(
      "farmshare-custom-presets",
      JSON.stringify(updatedPresets)
    );

    setSnackbar({
      open: true,
      message: `Preset "${presetName}" deleted successfully!`,
      severity: "success",
    });
  };

  const confirmClearAll = () => {
    setSelectedSpecies([]);
    setVolumes({} as Record<EAnimalSpecies, string>);
    setClearDialogOpen(false);
    setSnackbar({
      open: true,
      message: "All data cleared",
      severity: "success",
    });
  };

  const handleExportCSV = () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before exporting.",
        severity: "error",
      });
      return;
    }

    if (hasEmptyVolumes()) {
      setSnackbar({
        open: true,
        message: "Volume data can't be empty.",
        severity: "error",
      });
      return;
    }

    if (handleValidationErrors()) {
      setSnackbar({
        open: true,
        message: "Please fix vaildation errors.",
        severity: "error",
      });
      return;
    }

    exportCSV({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
    });

    setSnackbar({
      open: true,
      message: "CSV exported successfully!",
      severity: "success",
    });
  };

  const handleExportPDF = async () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before exporting.",
        severity: "error",
      });
      return;
    }

    if (hasEmptyVolumes()) {
      setSnackbar({
        open: true,
        message: "Volume data can't be empty.",
        severity: "error",
      });
      return;
    }

    if (handleValidationErrors()) {
      setSnackbar({
        open: true,
        message: "Please fix validation errors.",
        severity: "error",
      });
      return;
    }

    await exportPDF({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
    });

    setSnackbar({
      open: true,
      message: "PDF exported successfully!",
      severity: "success",
    });
  };

  const isAnnualHangingInvalid = (species: EAnimalSpecies) => {
    if (+volumes[species] < 0 || +volumes[species] > 10000000) {
      return true;
    } else {
      return false;
    }
  };

  const isHourlyWageValid = +hourlyWage < 1 || +hourlyWage > 200;

  const isTimePerAnimalValid = +timePerAnimal < 1 || +timePerAnimal > 480;

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meat Processor Value Calculator
        </Typography>

        <Paper sx={{ p: 2, mb: 3, width: "525px" }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Load Preset</InputLabel>
              <Select
                defaultValue="none"
                label="Load Preset"
                onChange={handlePresetChange}
              >
                <MenuItem value="none">
                  <em>None - Start from scratch</em>
                </MenuItem>
                <MenuItem
                  disabled
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "text.secondary",
                  }}
                >
                  Default Presets
                </MenuItem>
                <MenuItem value="beefFocused">Beef-Focused Processor</MenuItem>
                <MenuItem value="mixedOperation">Mixed Operation</MenuItem>
                <MenuItem value="smallFarm">Small Farm Processor</MenuItem>
                <MenuItem value="largeCommercial">Large Commercial</MenuItem>

                {customPresets.length > 0 && (
                  <MenuItem
                    disabled
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "text.secondary",
                    }}
                  >
                    Custom Presets
                  </MenuItem>
                )}
                {customPresets.map((preset) => (
                  <MenuItem key={preset.name} value={`custom-${preset.name}`}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span>{preset.name}</span>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomPreset(preset.name);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => setSavePresetDialogOpen(true)}
            >
              Save
            </Button>
            <Button onClick={handleClearAll}>Clear All</Button>
          </Box>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Animal Species</InputLabel>
            <Select
              multiple
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              input={<OutlinedInput label="Select Animal Species" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value.charAt(0).toUpperCase() + value.slice(1)}
                      onDelete={() => {
                        setSelectedSpecies(
                          selectedSpecies.filter((spec) => spec !== value)
                        );
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

          {selectedSpecies.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Annual Processing Volume by Species
              </Typography>
              {selectedSpecies.map((species) => (
                <Card key={species} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {species.charAt(0).toUpperCase() + species.slice(1)}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        (Avg: {AVG_HANGING_WEIGHTS[species]} lbs/animal)
                      </Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      label="Total Annual Hanging Weight (lbs)"
                      type="number"
                      value={volumes[species] || ""}
                      onChange={(e) =>
                        handleVolumeChange(species, e.target.value)
                      }
                      slotProps={{
                        htmlInput: { min: 0, max: 10000000 },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">lbs</InputAdornment>
                          ),
                        },
                      }}
                      error={isAnnualHangingInvalid(species)}
                      helperText={
                        isAnnualHangingInvalid(species)
                          ? "Enter a value between 0 and 10,000,000"
                          : " "
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Advanced Settings
            </Typography>
            <IconButton
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{
                transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={showAdvanced}>
            <TextField
              fullWidth
              label="Time Savings per Animal (minutes)"
              type="number"
              value={timePerAnimal}
              onChange={(e) => setTimePerAnimal(e.target.value)}
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">mins</InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
              error={isTimePerAnimalValid}
              helperText={
                isTimePerAnimalValid
                  ? "Enter a value between 1 minute and 480 minutes"
                  : " "
              }
            />
            <TextField
              fullWidth
              label="Average Hourly Wage ($)"
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  endAdornment: (
                    <InputAdornment position="start">&nbsp;$</InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
              error={isHourlyWageValid}
              helperText={
                isHourlyWageValid ? "Enter a value between $7.25 and $200" : " "
              }
            />
          </Collapse>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5">Annual Summary</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" size="small" onClick={handleExportCSV}>
                Export CSV
              </Button>
              <Button variant="outlined" size="small" onClick={handleExportPDF}>
                Export PDF
              </Button>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                pb: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body1">Total Annual Volume:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {getTotalVolume().toLocaleString()} lbs
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                pb: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body1" color="success.main">
                Total Annual Savings:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                $
                {calculateTotalAnnualSavings().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="body1" color="error.main">
                Total Annual Cost:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="error.main">
                $
                {calculateTotalAnnualCost().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 2,
                borderTop: 2,
                borderColor: "primary.main",
              }}
            >
              <Typography variant="h6">Net Annual Benefit:</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                $
                {(
                  calculateTotalAnnualSavings() - calculateTotalAnnualCost()
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>
        <SavingsChart
          selectedSpecies={selectedSpecies}
          volumes={volumes}
          timePerAnimal={timePerAnimal}
          hourlyWage={hourlyWage}
          savings={calculateTotalAnnualSavings()}
          cost={calculateTotalAnnualCost()}
          netBenefit={
            calculateTotalAnnualSavings() - calculateTotalAnnualCost()
          }
        />
        <BeforeAfterComparison
          selectedSpecies={selectedSpecies}
          withPlatformSavings={calculateTotalAnnualSavings()}
          withPlatformCost={calculateTotalAnnualCost()}
          withPlatformBenefit={
            calculateTotalAnnualSavings() - calculateTotalAnnualCost()
          }
        />

        {/* Species Mix Comparison Section */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Compare Different Species Mixes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Input two different scenarios to compare profitability
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Scenario A */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#006B3C" }}>
                Scenario A
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
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: "#C83232" }}>
                Scenario B
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
        </Paper>

        <SpeciesMixComparison
          scenarioA={{
            name: "Scenario A",
            selectedSpecies: scenarioASpecies,
            volumes: scenarioAVolumes,
            timePerAnimal,
            hourlyWage,
          }}
          scenarioB={{
            name: "Scenario B",
            selectedSpecies: scenarioBSpecies,
            volumes: scenarioBVolumes,
            timePerAnimal,
            hourlyWage,
          }}
        />
      </Box>
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all selected species and volume data?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={savePresetDialogOpen}
        onClose={() => setSavePresetDialogOpen(false)}
      >
        <DialogTitle>Save Custom Preset</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Save your current calculator settings as a custom preset for quick
            access later.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g., My Farm Mix"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSavePreset();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSavePresetDialogOpen(false);
              setPresetName("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePreset}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Preset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
