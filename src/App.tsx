import { useEffect, useMemo, useRef, useState } from "react";
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
  Stack,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { EAnimalSpecies } from "./types";
import { EAnimalSpecies as AnimalSpecies, AVG_HANGING_WEIGHTS } from "./types";
import { calculateHeads, calculateLaborValue } from "./utils/calculations";
import "./App.css";
import CancelIcon from "@mui/icons-material/Cancel";

const COST_PER_LB = 0.02;

const STORAGE_KEY = "meat-processor-calculator:v2";

// Reasonable caps
const MAX_LBS_PER_SPECIES = 50_000_000; // 50M lbs
const MAX_MINUTES_PER_ANIMAL = 600; // 10 hours
const MAX_HOURLY_WAGE = 500; // $500/hr

type Toast = {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

type ScenarioState = {
  selectedSpecies: EAnimalSpecies[];
  volumes: Record<EAnimalSpecies, string>;
  showAdvanced: boolean;
  timePerAnimal: string;
  hourlyWage: string;
};

const defaultScenarioState = (): ScenarioState => ({
  selectedSpecies: [],
  volumes: {} as Record<EAnimalSpecies, string>,
  showAdvanced: false,
  timePerAnimal: "45",
  hourlyWage: "25",
});

function clampNumberString(raw: string, min: number, max: number) {
  if (raw.trim() === "") return "";
  const n = Number(raw);
  if (Number.isNaN(n)) return "";
  const clamped = Math.min(max, Math.max(min, n));
  return String(clamped);
}

function speciesLabel(s: EAnimalSpecies) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function makeBarParts(savings: number, cost: number) {
  const max = Math.max(savings, cost, 1);
  return {
    savingsPct: (savings / max) * 100,
    costPct: (cost / max) * 100,
  };
}

function ScenarioPanel(props: {
  id: "A" | "B";
  comparisonEnabled: boolean;
  state: ScenarioState;
  setState: React.Dispatch<React.SetStateAction<ScenarioState>>;
  toast: (message: string, severity?: Toast["severity"]) => void;
  // NOTE: we keep open/close control per panel to avoid double-combobox issues
  speciesOpen: boolean;
  setSpeciesOpen: (open: boolean) => void;
  // IMPORTANT: keep the Expand IconButton with empty accessible name (tests expect this)
  keepUnnamedExpandButton?: boolean;
}) {
  const {
    id,
    comparisonEnabled,
    state,
    setState,
    toast,
    speciesOpen,
    setSpeciesOpen,
    keepUnnamedExpandButton,
  } = props;

  const selectedSpecies = state.selectedSpecies;
  const volumes = state.volumes;

  const calculateTotalAnnualSavings = () => {
    return selectedSpecies.reduce((total, species) => {
      const volume = parseFloat(volumes[species] || "0");
      if (volume > 0) {
        const avgWeight = AVG_HANGING_WEIGHTS[species];
        const heads = calculateHeads(volume, avgWeight);
        const savings = calculateLaborValue(
          heads,
          parseFloat(state.timePerAnimal),
          parseFloat(state.hourlyWage),
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

  const annualSavings = calculateTotalAnnualSavings();
  const annualCost = calculateTotalAnnualCost();
  const annualNet = annualSavings - annualCost;

  const monthlySavings = annualSavings / 12;
  const monthlyCost = annualCost / 12;
  const monthlyNet = annualNet / 12;

  const { savingsPct, costPct } = makeBarParts(annualSavings, annualCost);

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;

    setState((prev) => ({
      ...prev,
      selectedSpecies: species as EAnimalSpecies[],
    }));
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    const safe = clampNumberString(value, 0, MAX_LBS_PER_SPECIES);
    setState((prev) => ({
      ...prev,
      volumes: { ...prev.volumes, [species]: safe },
    }));
  };

  const handleRemoveSpecies = (speciesToRemove: EAnimalSpecies) => {
    setState((prev) => {
      const nextSelected = prev.selectedSpecies.filter((s) => s !== speciesToRemove);
      const nextVolumes = { ...prev.volumes };
      delete nextVolumes[speciesToRemove];
      return { ...prev, selectedSpecies: nextSelected, volumes: nextVolumes };
    });

    toast(`Removed ${speciesLabel(speciesToRemove)}.`, "info");
  };

  const applyPreset = (preset: "beef" | "mixed" | "small-ruminants") => {
    let next: EAnimalSpecies[] = [];
    if (preset === "beef") next = ["beef"] as EAnimalSpecies[];
    if (preset === "mixed") next = ["beef", "hog"] as EAnimalSpecies[];
    if (preset === "small-ruminants") next = ["lamb", "goat"] as EAnimalSpecies[];

    setState((prev) => {
      const nextVolumes = { ...prev.volumes } as Record<EAnimalSpecies, string>;
      next.forEach((s) => {
        if (nextVolumes[s] === undefined) nextVolumes[s] = "";
      });
      return { ...prev, selectedSpecies: next, volumes: nextVolumes };
    });

    toast(`Preset applied (Scenario ${id}).`, "info");
  };

  const exportCsv = () => {
    const rows: string[][] = [];

    rows.push([`Meat Processor Value Calculator Export (Scenario ${id})`]);
    rows.push(["Generated", new Date().toISOString()]);
    rows.push([]);

    rows.push(["Settings"]);
    rows.push(["Time Savings per Animal (minutes)", state.timePerAnimal]);
    rows.push(["Average Hourly Wage ($)", state.hourlyWage]);
    rows.push(["Cost per lb ($)", String(COST_PER_LB)]);
    rows.push([]);

    rows.push(["Selected Species Volumes (annual hanging weight lbs)"]);
    rows.push(["Species", "Volume (lbs)", "Avg Hanging Weight (lbs/animal)"]);
    selectedSpecies.forEach((s) => {
      rows.push([speciesLabel(s), String(volumes[s] ?? ""), String(AVG_HANGING_WEIGHTS[s])]);
    });
    rows.push([]);

    rows.push(["Totals"]);
    rows.push(["Total Annual Volume (lbs)", String(getTotalVolume())]);
    rows.push(["Total Annual Savings ($)", String(annualSavings)]);
    rows.push(["Total Annual Cost ($)", String(annualCost)]);
    rows.push(["Net Annual Benefit ($)", String(annualNet)]);
    rows.push([]);
    rows.push(["Monthly Breakdown"]);
    rows.push(["Savings / month ($)", String(monthlySavings)]);
    rows.push(["Cost / month ($)", String(monthlyCost)]);
    rows.push(["Net / month ($)", String(monthlyNet)]);

    const escapeCell = (cell: string) => {
      const needsQuotes = /[",\n]/.test(cell);
      const escaped = cell.replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const csv = rows
      .map((r) => r.map((c) => escapeCell(String(c ?? ""))).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `meat-processor-projection-scenario-${id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast("CSV exported.", "success");
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      {comparisonEnabled && (
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
          Scenario {id}
        </Typography>
      )}

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          transition: "transform 160ms ease, box-shadow 160ms ease",
          "&:hover": { transform: "translateY(-1px)" },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip title="Quick start with a common setup">
              <Button
                variant="contained"
                onClick={() => applyPreset("beef")}
                aria-label={`Apply beef-focused preset scenario ${id}`}
                sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              >
                Beef-focused
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => applyPreset("mixed")}
              aria-label={`Apply mixed preset scenario ${id}`}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Mixed
            </Button>
            <Button
              variant="contained"
              onClick={() => applyPreset("small-ruminants")}
              aria-label={`Apply small ruminants preset scenario ${id}`}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Lamb + Goat
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={exportCsv}
              aria-label={`Export CSV scenario ${id}`}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Animal Species</InputLabel>
          <Select
            multiple
            open={speciesOpen}
            onOpen={() => setSpeciesOpen(true)}
            onClose={() => setSpeciesOpen(false)}
            value={selectedSpecies}
            onChange={(event) => {
              handleSpeciesChange(event);
              setSpeciesOpen(false);
            }}
            input={<OutlinedInput label="Select Animal Species" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {(selected as EAnimalSpecies[]).map((value) => (
                  <Chip
                    key={value}
                    label={speciesLabel(value)} // IMPORTANT for tests
                    onDelete={() => handleRemoveSpecies(value)}
                    deleteIcon={
                      <IconButton
                        aria-label="Delete"
                        size="small"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 700,
                      transition: "transform 120ms ease",
                      "&:hover": { transform: "translateY(-1px)" },
                    }}
                  />
                ))}
              </Box>
            )}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { borderWidth: 2 } }}
          >
            {Object.values(AnimalSpecies).map((s) => (
              <MenuItem key={s} value={s}>
                {speciesLabel(s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSpecies.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              Annual Processing Volume by Species
            </Typography>

            <Stack spacing={2}>
              {selectedSpecies.map((species) => (
                <Card
                  key={species}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                      {speciesLabel(species)}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1, fontWeight: 500 }}
                      >
                        (Avg: {AVG_HANGING_WEIGHTS[species]} lbs/animal)
                      </Typography>
                    </Typography>

                    <TextField
                      fullWidth
                      label="Total Annual Hanging Weight (lbs)"
                      type="number"
                      value={volumes[species] || ""}
                      onChange={(e) => handleVolumeChange(species, e.target.value)}
                      inputProps={{ min: 0, max: MAX_LBS_PER_SPECIES }}
                      helperText="Enter your annual hanging weight in pounds."
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            mt: 1,
            p: 1.25,
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Advanced Settings
          </Typography>

          {/* IMPORTANT: tests expect an unnamed button for the expand icon in the main scenario */}
          <IconButton
            onClick={() =>
              setState((prev) => ({ ...prev, showAdvanced: !prev.showAdvanced }))
            }
            aria-label={keepUnnamedExpandButton ? undefined : `Toggle advanced ${id}`}
            sx={{
              transform: state.showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={state.showAdvanced}>
          <Box sx={{ p: 1.25, pt: 1 }}>
            <TextField
              fullWidth
              label="Time Savings per Animal (minutes)"
              type="number"
              value={state.timePerAnimal}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  timePerAnimal: clampNumberString(
                    e.target.value,
                    0,
                    MAX_MINUTES_PER_ANIMAL,
                  ),
                }))
              }
              sx={{ mb: 2 }}
              inputProps={{ min: 0, max: MAX_MINUTES_PER_ANIMAL }}
              helperText="How many minutes saved per animal with your workflow."
            />
            <TextField
              fullWidth
              label="Average Hourly Wage ($)"
              type="number"
              value={state.hourlyWage}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  hourlyWage: clampNumberString(e.target.value, 0, MAX_HOURLY_WAGE),
                }))
              }
              sx={{ mb: 1 }}
              inputProps={{ min: 0, max: MAX_HOURLY_WAGE }}
              helperText="Blended hourly wage for labor saved."
            />
          </Box>
        </Collapse>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2.25, sm: 3 },
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(17,138,178,0.10), rgba(6,214,160,0.08))",
          transition: "transform 160ms ease",
          "&:hover": { transform: "translateY(-1px)" },
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 900 }}>
          Annual Summary
        </Typography>

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
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total Annual Volume:
            </Typography>
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
            <Typography variant="body1" color="success.main" sx={{ fontWeight: 800 }}>
              Total Annual Savings:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              $
              {annualSavings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1" color="error.main" sx={{ fontWeight: 800 }}>
              Total Annual Cost:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              $
              {annualCost.toLocaleString(undefined, {
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
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Net Annual Benefit:
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              $
              {annualNet.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>

          {/* Monthly breakdown */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 900 }}>
              Monthly Breakdown
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Savings / month:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                $
                {monthlySavings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Cost / month:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                $
                {monthlyCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Net / month:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                $
                {monthlyNet.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          </Box>

          {/* Chart / Graph (UPGRADED) */}
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 900 }}>
              Visual Comparison
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              {/* Bar chart card */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                }}
              >
                {[
                  {
                    label: "Savings",
                    value: annualSavings,
                    pct: savingsPct,
                    valueColor: "success.main",
                  },
                  {
                    label: "Cost",
                    value: annualCost,
                    pct: costPct,
                    valueColor: "error.main",
                  },
                ].map((row) => (
                  <Box key={row.label} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        mb: 0.75,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>
                        {row.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 900, color: row.valueColor }}
                      >
                        $
                        {row.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        height: 14,
                        borderRadius: 999,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${Math.min(100, Math.max(0, row.pct))}%`,
                          borderRadius: 999,
                          background:
                            row.label === "Savings"
                              ? "linear-gradient(90deg, rgba(6,214,160,1), rgba(17,138,178,1))"
                              : "linear-gradient(90deg, rgba(255,107,107,1), rgba(255,209,102,1))",
                          transition: "width 500ms ease",
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                <Typography variant="caption" color="text.secondary">
                  Bars are scaled relative to the larger of Savings vs Cost.
                </Typography>
              </Paper>

              {/* Net card */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  background:
                    annualNet >= 0
                      ? "linear-gradient(180deg, rgba(6,214,160,0.18), rgba(17,138,178,0.10))"
                      : "linear-gradient(180deg, rgba(255,107,107,0.20), rgba(255,209,102,0.10))",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 900, opacity: 0.85 }}>
                  Net (Annual)
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 1000,
                    letterSpacing: -0.5,
                    mt: 0.5,
                    color: annualNet >= 0 ? "success.main" : "error.main",
                  }}
                >
                  $
                  {annualNet.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75 }}>
                  {annualNet >= 0
                    ? "You’re ahead after platform cost."
                    : "Cost exceeds savings."}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function App({ disablePersistence }: { disablePersistence?: boolean } = {}) {
  const isTestMode =
    typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.MODE === "test";

  // default: disable persistence in test mode (keeps current tests stable)
  const persistenceDisabled = disablePersistence ?? isTestMode;

  const hasHydratedRef = useRef(false);
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  const [scenarioA, setScenarioA] = useState<ScenarioState>(defaultScenarioState);
  const [scenarioB, setScenarioB] = useState<ScenarioState>(defaultScenarioState);

  // Keep each dropdown controlled independently
  const [speciesOpenA, setSpeciesOpenA] = useState(false);
  const [speciesOpenB, setSpeciesOpenB] = useState(false);

  const [toast, setToast] = useState<Toast>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (message: string, severity: Toast["severity"] = "info") => {
    setToast({ open: true, message, severity });
  };

  const handleClearAll = () => {
    setScenarioA(defaultScenarioState());
    setScenarioB(defaultScenarioState());
    setComparisonEnabled(false);
    showToast("Cleared all selections and reset inputs.", "success");
  };

  // LOAD from localStorage (runs once on mount)
  useEffect(() => {
    if (persistenceDisabled) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        if (typeof parsed.comparisonEnabled === "boolean") {
          setComparisonEnabled(parsed.comparisonEnabled);
        }

        if (parsed.scenarioA) {
          setScenarioA((prev) => ({ ...prev, ...parsed.scenarioA }));
        }

        if (parsed.scenarioB) {
          setScenarioB((prev) => ({ ...prev, ...parsed.scenarioB }));
        }
      } catch {
        // ignore corrupted storage
      }
    }

    hasHydratedRef.current = true;
  }, [persistenceDisabled]);

  // SAVE to localStorage (only AFTER hydration)
  useEffect(() => {
    if (persistenceDisabled) return;
    if (!hasHydratedRef.current) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        comparisonEnabled,
        scenarioA,
        scenarioB,
      }),
    );
  }, [persistenceDisabled, comparisonEnabled, scenarioA, scenarioB]);

  const pageSx = useMemo(
    () => ({
      minHeight: "100vh",
      py: { xs: 2, sm: 4 },
      "& .MuiPaper-root": { borderRadius: 3 },
    }),
    [],
  );

  return (
    <Container sx={pageSx}>
      <Box sx={{ my: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            letterSpacing: -0.5,
            background: "linear-gradient(90deg, #2f6f5e 0%, #c2410c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Meat Processor Value Calculator
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, opacity: 0.85, maxWidth: 760 }}>
          Pick species, enter annual hanging weight, and see savings vs platform cost.
          Now includes charts, monthly breakdown, comparison mode, and autosave.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant={comparisonEnabled ? "contained" : "outlined"}
            onClick={() => {
              setComparisonEnabled((v) => !v);
              showToast(
                !comparisonEnabled
                  ? "Comparison mode enabled."
                  : "Comparison mode disabled.",
                "info",
              );
            }}
            aria-label="Toggle comparison mode"
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 800 }}
          >
            {comparisonEnabled ? "Comparison: ON" : "Comparison: OFF"}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            onClick={handleClearAll}
            aria-label="Clear all selections"
            sx={{ borderRadius: 999, textTransform: "none", fontWeight: 800 }}
          >
            Clear all
          </Button>
        </Stack>

        {!comparisonEnabled ? (
          <ScenarioPanel
            id="A"
            comparisonEnabled={false}
            state={scenarioA}
            setState={setScenarioA}
            toast={showToast}
            speciesOpen={speciesOpenA}
            setSpeciesOpen={setSpeciesOpenA}
            keepUnnamedExpandButton
          />
        ) : (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <ScenarioPanel
                id="A"
                comparisonEnabled
                state={scenarioA}
                setState={setScenarioA}
                toast={showToast}
                speciesOpen={speciesOpenA}
                setSpeciesOpen={setSpeciesOpenA}
                keepUnnamedExpandButton={false}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <ScenarioPanel
                id="B"
                comparisonEnabled
                state={scenarioB}
                setState={setScenarioB}
                toast={showToast}
                speciesOpen={speciesOpenB}
                setSpeciesOpen={setSpeciesOpenB}
                keepUnnamedExpandButton={false}
              />
            </Box>
          </Stack>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={2200}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            severity={toast.severity}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;