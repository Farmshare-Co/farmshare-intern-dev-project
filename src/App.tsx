import { useState } from "react";
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
  Grid,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EAnimalSpecies } from "./types";
import { EAnimalSpecies as AnimalSpecies, AVG_HANGING_WEIGHTS } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";

const COST_PER_LB = 0.02;

function App() {
  const [selectedSpecies, setSelectedSpecies] = useState<EAnimalSpecies[]>([]);
  const [volumes, setVolumes] = useState<Record<EAnimalSpecies, string>>(
    {} as Record<EAnimalSpecies, string>,
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [timePerAnimal, setTimePerAnimal] = useState("45"); // minutes
  const [hourlyWage, setHourlyWage] = useState("25"); // dollars

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
  };
  const handleDelete = (speciesToDelete: EAnimalSpecies) => {
    setSelectedSpecies((prev) => prev.filter((s) => s !== speciesToDelete));
  };

  const handleClearAll = () => {
    setSelectedSpecies([]);
    setVolumes({} as Record<EAnimalSpecies, string>);
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    setVolumes((prev) => ({ ...prev, [species]: value }));
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
          parseFloat(hourlyWage),
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

  const getTotalVolume = () => {
    return selectedSpecies.reduce((total, species) => {
      return total + parseFloat(volumes[species] || "0");
    }, 0);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%' }}>
      <Box sx={{ pb: 8 }}>
        <Box className="hero-header">
          <Container maxWidth="md">
            <Typography variant="h3" component="h1" fontWeight="700" gutterBottom>
              Meat Processor Value Calculator
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Maximize your labor savings. Minimize your costs. Grow your farm.
            </Typography>
          </Container>
        </Box>
        <Container maxWidth={false} sx={{ mt: -4, px: { xs: 2, lg: 8 } }}>
          <Grid container spacing={4}>
            {/* LEFT COLUMN: INPUTS */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper className="premium-card" sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h5" fontWeight="700">1. Setup Your Data</Typography>
                  <Button
                    color="error"
                    onClick={handleClearAll}
                    disabled={selectedSpecies.length === 0}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear All
                  </Button>
                </Box>

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>Select Animal Species</InputLabel>
                  <Select
                    multiple
                    value={selectedSpecies}
                    onChange={handleSpeciesChange}
                    input={<OutlinedInput label="Select Animal Species" />}
                    sx={{ borderRadius: 3 }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value.charAt(0).toUpperCase() + value.slice(1)}
                            onDelete={() => handleDelete(value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {Object.values(AnimalSpecies).map((s) => (
                      <MenuItem key={s} value={s} sx={{ py: 1.5 }}>
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
                            inputProps={{ min: 0 }}
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
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Average Hourly Wage ($)"
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Collapse>
              </Paper>
            </Grid>
            {/* RIGHT COLUMN: SUMMARY */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper className="premium-card summary-container" sx={{ p: 4, position: { md: 'sticky' }, top: 24 }}>
                <Typography variant="h5" fontWeight="800" sx={{ color: 'white', mb: 4 }}>
                  Annual Summary
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>Total Annual Volume:</Typography>
                  <Typography variant="h3" fontWeight="800" sx={{ mt: 1 }}>
                    {getTotalVolume().toLocaleString()} <Typography component="span" variant="h5">lbs</Typography>
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Annual Savings:</Typography>
                  <Typography variant="body1" fontWeight="700" color="#a5d6a7">
                    + ${calculateTotalAnnualSavings().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Annual Cost:</Typography>
                  <Typography variant="body1" fontWeight="700" color="#ef9a9a">
                    - ${calculateTotalAnnualCost().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ my: 4, height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 1 }}>Net Annual Benefit:</Typography>
                  <Typography variant="h3" fontWeight="900" sx={{ color: '#ffd54f', mt: 1 }}>
                    ${(calculateTotalAnnualSavings() - calculateTotalAnnualCost()).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.6 }}>
                    *Based on selected species and assumptions
                  </Typography>
                </Box>

                {/* FINANCIAL VISUALIZATION BAR CHART */}
                {(calculateTotalAnnualSavings() > 0 || calculateTotalAnnualCost() > 0) && (
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 3, letterSpacing: 1.5 }}>FINANCIAL VISUALIZATION</Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#a5d6a7', fontWeight: 700 }}>Total Savings</Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 10, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{
                          width: `${Math.max(1, (calculateTotalAnnualSavings() / Math.max(0.01, Math.max(calculateTotalAnnualSavings(), calculateTotalAnnualCost()))) * 100)}%`,
                          height: '100%', bgcolor: '#a5d6a7', transition: 'width 1s ease-in-out'
                        }} />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#ef9a9a', fontWeight: 700 }}>Total Cost</Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 10, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{
                          width: `${Math.max(1, (calculateTotalAnnualCost() / Math.max(0.01, Math.max(calculateTotalAnnualSavings(), calculateTotalAnnualCost()))) * 100)}%`,
                          height: '100%', bgcolor: '#ef9a9a', transition: 'width 1s ease-in-out'
                        }} />
                      </Box>
                    </Box>
                  </Box>
                )}

              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
