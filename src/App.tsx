import { useContext } from "react";
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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import type { SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EAnimalSpecies } from "./types";
import { EAnimalSpecies as AnimalSpecies, AVG_HANGING_WEIGHTS } from "./types";
import { exportCSV } from "./utils/exportCSV";
import { exportPDF } from "./utils/exportPDF";
import "./App.css";
import { FarmContext } from "./context/FarmContext";

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

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    setVolumes((prev) => ({ ...prev, [species]: value }));
  };

  const handleClearAll = () => {
    setSelectedSpecies([]);
    setVolumes({} as Record<EAnimalSpecies, string>);
  };

  const handleExportCSV = () => {
    exportCSV({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
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
          <Button onClick={handleClearAll}>Clear All</Button>
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
      </Box>
    </Container>
  );
}

export default App;
