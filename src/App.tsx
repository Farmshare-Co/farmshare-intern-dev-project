import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { CalculatorInputs, EAnimalSpecies } from "./types";
import {
  AdvancedSettingsPanel,
  AnnualSummary,
  CalculatorActionsBar,
  ComparisonPanel,
  ClearAllDialog,
  MonthlyBreakdown,
  ProjectionChart,
  SavePresetDialog,
  SpeciesPresetsBar,
  SpeciesSelectField,
  VolumeInputsSection,
} from "./components";
import {
  MAX_ANNUAL_VOLUME,
  MAX_HOURLY_WAGE,
  MAX_TIME_PER_ANIMAL_MINUTES,
} from "./constants/calculator";
import {
  hasValidationErrors,
  validateInputs,
} from "./utils/validation";
import {
  clearPersistedState,
  loadPersistedState,
  persistState,
} from "./utils/storage";
import {
  calculatorReducer,
  createInitialCalculatorState,
  isDefaultCalculatorState,
  type ScenarioSlot,
} from "./state/calculatorReducer";
import { calculateProjection } from "./utils/projection";
import { createProjectionCsv, downloadCsv } from "./utils/export";
import { printProjectionReport } from "./utils/print";
import "./App.css";

function App() {
  const initialPersistedState = useMemo(() => loadPersistedState(), []);
  const [calculatorState, dispatch] = useReducer(
    calculatorReducer,
    initialPersistedState,
    createInitialCalculatorState,
  );
  const {
    selectedSpecies,
    volumes,
    showAdvanced,
    timePerAnimal,
    hourlyWage,
    comparison,
    customPresets,
  } = calculatorState;

  const [isSpeciesMenuOpen, setIsSpeciesMenuOpen] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [showSavePresetDialog, setShowSavePresetDialog] = useState(false);
  const menuReopenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPersistedInitialState = useRef(false);
  const currentInputs = useMemo<CalculatorInputs>(
    () => ({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
    }),
    [selectedSpecies, volumes, timePerAnimal, hourlyWage],
  );
  const validationErrors = useMemo(
    () => validateInputs(currentInputs),
    [currentInputs],
  );
  const currentProjection = useMemo(
    () => calculateProjection(currentInputs),
    [currentInputs],
  );
  const scenarioAProjection = useMemo(
    () => (comparison.A ? calculateProjection(comparison.A.inputs) : null),
    [comparison.A],
  );
  const scenarioBProjection = useMemo(
    () => (comparison.B ? calculateProjection(comparison.B.inputs) : null),
    [comparison.B],
  );
  const hasErrors = hasValidationErrors(validationErrors);
  const isAtDefaults = isDefaultCalculatorState(calculatorState);

  useEffect(() => {
    if (!hasPersistedInitialState.current) {
      hasPersistedInitialState.current = true;
      return;
    }

    if (isDefaultCalculatorState(calculatorState)) {
      clearPersistedState();
      return;
    }

    persistState(calculatorState);
  }, [calculatorState]);

  useEffect(
    () => () => {
      if (menuReopenTimer.current !== null) {
        clearTimeout(menuReopenTimer.current);
      }
    },
    [],
  );

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    dispatch({
      type: "setSelectedSpecies",
      payload: species as EAnimalSpecies[],
    });

    if (menuReopenTimer.current !== null) {
      clearTimeout(menuReopenTimer.current);
    }
    menuReopenTimer.current = setTimeout(() => {
      setIsSpeciesMenuOpen(true);
      menuReopenTimer.current = null;
    }, 0);
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    dispatch({
      type: "setVolume",
      payload: { species, value },
    });
  };

  const handleSpeciesRemove = (speciesToRemove: EAnimalSpecies) => {
    dispatch({
      type: "removeSpecies",
      payload: speciesToRemove,
    });
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = customPresets.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }

    dispatch({
      type: "applyPreset",
      payload: preset,
    });
    setIsSpeciesMenuOpen(false);
  };

  const handleDeleteCustomPreset = (presetId: string) => {
    dispatch({
      type: "deleteCustomPreset",
      payload: presetId,
    });
  };

  const handleOpenSavePreset = () => {
    setShowSavePresetDialog(true);
  };

  const handleCloseSavePreset = () => {
    setShowSavePresetDialog(false);
  };

  const handleConfirmSavePreset = (presetName: string) => {
    const normalizedName = presetName.trim();
    if (!normalizedName) {
      return;
    }

    const existingPreset = customPresets.find(
      (preset) => preset.label.toLowerCase() === normalizedName.toLowerCase(),
    );
    const presetId =
      existingPreset?.id ??
      `custom-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

    dispatch({
      type: "saveCustomPreset",
      payload: {
        id: presetId,
        label: normalizedName,
      },
    });
    setShowSavePresetDialog(false);
  };

  const resetToDefaults = () => {
    dispatch({ type: "resetDefaults" });
    setIsSpeciesMenuOpen(false);
  };

  const handleOpenClearAll = () => {
    setShowClearAllDialog(true);
  };

  const handleCloseClearAll = () => {
    setShowClearAllDialog(false);
  };

  const handleConfirmClearAll = () => {
    clearPersistedState();
    resetToDefaults();
    setShowClearAllDialog(false);
  };

  const handleSaveScenario = (slot: ScenarioSlot) => {
    dispatch({
      type: "saveScenario",
      payload: {
        slot,
        capturedAt: new Date().toISOString(),
      },
    });
  };

  const handleClearScenario = (slot: ScenarioSlot) => {
    dispatch({
      type: "clearScenario",
      payload: slot,
    });
  };

  const handleExportCsv = () => {
    const csvContent = createProjectionCsv(currentProjection, currentInputs);
    const fileDate = new Date().toISOString().slice(0, 10);
    downloadCsv(`farmshare-projection-${fileDate}.csv`, csvContent);
  };

  const handlePrintReport = () => {
    printProjectionReport(currentProjection, currentInputs);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: "1680px",
        px: { xs: 1.25, sm: 3, md: 4, lg: 5 },
        overflow: "hidden",
      }}
    >
      <Box className="app-shell" sx={{ my: { xs: 3, md: 4 } }}>
        <Box className="app-hero">
          <Box className="app-brand" aria-label="Farmshare">
            <span className="app-brand-wordmark">farmshare</span>
          </Box>
          <Typography
            className="app-title"
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ mb: 1, fontSize: { xs: "2rem", sm: "2.375rem" } }}
          >
            Meat Processor Value Calculator
          </Typography>
          <Typography className="app-subtitle" variant="body1">
            Estimate annual and monthly impact, compare scenarios, and export
            results for review.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(380px, 430px) minmax(0, 1fr)",
            },
            alignItems: "start",
            minWidth: 0,
          }}
        >
          <Paper
            className="control-panel"
            sx={{
              p: 2.5,
              position: { xl: "sticky" },
              top: { xl: 24 },
              minWidth: 0,
            }}
          >
            <SpeciesPresetsBar
              customPresets={customPresets}
              onApplyPreset={handleApplyPreset}
              onDeleteCustomPreset={handleDeleteCustomPreset}
            />
            <SpeciesSelectField
              selectedSpecies={selectedSpecies}
              isSpeciesMenuOpen={isSpeciesMenuOpen}
              onSpeciesChange={handleSpeciesChange}
              onSpeciesMenuOpen={() => setIsSpeciesMenuOpen(true)}
              onSpeciesMenuClose={() => setIsSpeciesMenuOpen(false)}
              onSpeciesRemove={handleSpeciesRemove}
            />

            <VolumeInputsSection
              selectedSpecies={selectedSpecies}
              volumes={volumes}
              volumeErrors={validationErrors.volumes}
              maxAnnualVolume={MAX_ANNUAL_VOLUME}
              onVolumeChange={handleVolumeChange}
            />
            <CalculatorActionsBar
              isClearAllDisabled={isAtDefaults}
              onOpenClearAll={handleOpenClearAll}
              onOpenSavePreset={handleOpenSavePreset}
              onExportCsv={handleExportCsv}
              onPrintReport={handlePrintReport}
              isExportDisabled={currentProjection.rows.length === 0}
              isSavePresetDisabled={selectedSpecies.length === 0}
            />

            <AdvancedSettingsPanel
              showAdvanced={showAdvanced}
              timePerAnimal={timePerAnimal}
              hourlyWage={hourlyWage}
              timePerAnimalError={validationErrors.timePerAnimal}
              hourlyWageError={validationErrors.hourlyWage}
              maxTimePerAnimal={MAX_TIME_PER_ANIMAL_MINUTES}
              maxHourlyWage={MAX_HOURLY_WAGE}
              onToggleAdvanced={() =>
                dispatch({
                  type: "setShowAdvanced",
                  payload: !showAdvanced,
                })
              }
              onTimePerAnimalChange={(value) =>
                dispatch({
                  type: "setTimePerAnimal",
                  payload: value,
                })
              }
              onHourlyWageChange={(value) =>
                dispatch({
                  type: "setHourlyWage",
                  payload: value,
                })
              }
            />
          </Paper>

          <Box className="results-grid" sx={{ display: "grid", gap: 3, minWidth: 0 }}>
            <AnnualSummary
              totalAnnualVolume={currentProjection.totals.annualVolume}
              totalAnnualSavings={currentProjection.totals.annualSavings}
              totalAnnualCost={currentProjection.totals.annualCost}
              hasErrors={hasErrors}
            />
            <MonthlyBreakdown
              rows={currentProjection.rows}
              monthlyVolume={currentProjection.totals.monthlyVolume}
              monthlySavings={currentProjection.totals.monthlySavings}
              monthlyCost={currentProjection.totals.monthlyCost}
              monthlyNetBenefit={currentProjection.totals.monthlyNetBenefit}
            />
            <ProjectionChart projection={currentProjection} />
            <ComparisonPanel
              scenarioA={comparison.A}
              scenarioB={comparison.B}
              projectionA={scenarioAProjection}
              projectionB={scenarioBProjection}
              onSaveScenario={handleSaveScenario}
              onClearScenario={handleClearScenario}
            />
          </Box>
        </Box>

        <ClearAllDialog
          open={showClearAllDialog}
          onCancel={handleCloseClearAll}
          onConfirm={handleConfirmClearAll}
        />
        <SavePresetDialog
          open={showSavePresetDialog}
          onCancel={handleCloseSavePreset}
          onConfirm={handleConfirmSavePreset}
        />
      </Box>
    </Container>
  );
}

export default App;
