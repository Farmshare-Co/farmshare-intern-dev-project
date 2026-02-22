import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads, calculateLaborValue } from "../utils/calculations";
import { COST_PER_LB } from "../utils/statics";

interface ScenarioData {
  name: string;
  selectedSpecies: EAnimalSpecies[];
  volumes: Record<EAnimalSpecies, string>;
  timePerAnimal: string;
  hourlyWage: string;
}

interface SpeciesMixComparisonProps {
  scenarioA: ScenarioData;
  scenarioB: ScenarioData;
  onSettingsClick?: () => void;
}

export default function SpeciesMixComparison({
  scenarioA,
  scenarioB,
  onSettingsClick,
}: SpeciesMixComparisonProps) {
  // Calculate totals for Scenario A
  const calculateScenarioTotals = (scenario: ScenarioData) => {
    const savings = scenario.selectedSpecies.reduce((total, species) => {
      const volume = parseFloat(scenario.volumes[species] || "0");
      if (volume > 0) {
        const avgWeight = AVG_HANGING_WEIGHTS[species];
        const heads = calculateHeads(volume, avgWeight);
        const speciesSavings = calculateLaborValue(
          heads,
          parseFloat(scenario.timePerAnimal),
          parseFloat(scenario.hourlyWage)
        );
        return total + speciesSavings;
      }
      return total;
    }, 0);

    const cost = scenario.selectedSpecies.reduce((total, species) => {
      const volume = parseFloat(scenario.volumes[species] || "0");
      return total + volume * COST_PER_LB;
    }, 0);

    const benefit = savings - cost;

    return { savings, cost, benefit };
  };

  const totalsA = calculateScenarioTotals(scenarioA);
  const totalsB = calculateScenarioTotals(scenarioB);

  // Calculate differences
  const savingsDiff = totalsB.savings - totalsA.savings;
  const costDiff = totalsB.cost - totalsA.cost;
  const benefitDiff = totalsB.benefit - totalsA.benefit;

  if (
    scenarioA.selectedSpecies.length === 0 &&
    scenarioB.selectedSpecies.length === 0
  ) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 3,
        mt: 3,
        border: "2px solid #e0e0e0",
        boxShadow: "none",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: "roca" }}>
          Comparison Table
        </Typography>

        {onSettingsClick && (
          <Button
            variant="contained"
            onClick={onSettingsClick}
            sx={{
              backgroundColor: "farmGreen.main",
              color: "#fff",
              paddingX: 3,
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "farmGreen.main",
                boxShadow: "none",
                opacity: 1,
              },
            }}
          >
            Settings
          </Button>
        )}
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="left">
                <strong>Metric</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{scenarioA.name}</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{scenarioB.name}</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Difference</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Annual Time Savings</TableCell>
              <TableCell align="center" sx={{ color: "success.main" }}>
                ${totalsA.savings.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ color: "success.main" }}>
                ${totalsB.savings.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: savingsDiff >= 0 ? "success.main" : "error.main",
                  fontWeight: "bold",
                }}
              >
                {savingsDiff >= 0 ? "+" : ""}${savingsDiff.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annual Platform Cost</TableCell>
              <TableCell align="center" sx={{ color: "error.main" }}>
                ${totalsA.cost.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ color: "error.main" }}>
                ${totalsB.cost.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: costDiff <= 0 ? "success.main" : "error.main",
                }}
              >
                {costDiff >= 0 ? "+" : ""}${costDiff.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f0f9f4" }}>
              <TableCell>
                <strong>Net Annual Benefit</strong>
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#006B3C", fontWeight: "bold" }}
              >
                ${totalsA.benefit.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#006B3C", fontWeight: "bold" }}
              >
                ${totalsB.benefit.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: benefitDiff >= 0 ? "#006B3C" : "#C83232",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {benefitDiff >= 0 ? "+" : ""}${benefitDiff.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, backgroundColor: "#e8f5e9", borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: "#2e7d32" }}>
          <strong>Recommendation:</strong>{" "}
          {benefitDiff > 0
            ? `${scenarioB.name} provides $${benefitDiff.toFixed(
                2
              )} more annual benefit than ${scenarioA.name}.`
            : benefitDiff < 0
            ? `${scenarioA.name} provides $${Math.abs(benefitDiff).toFixed(
                2
              )} more annual benefit than ${scenarioB.name}.`
            : `Both scenarios provide equal annual benefit.`}
        </Typography>
      </Box>
    </Paper>
  );
}
