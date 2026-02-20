import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { EAnimalSpecies } from "../types";
import { AVG_HANGING_WEIGHTS } from "../types";
import { calculateHeads, calculateLaborValue } from "../utils/calculations";
import { COST_PER_LB } from "../utils/statics";

interface SavingsChartProps {
  selectedSpecies: EAnimalSpecies[];
  volumes: Record<EAnimalSpecies, string>;
  timePerAnimal: string;
  hourlyWage: string;
  savings: number;
  cost: number;
  netBenefit: number;
}

export default function SavingsChart({
  selectedSpecies,
  volumes,
  timePerAnimal,
  hourlyWage,
  savings,
  cost,
  netBenefit,
}: SavingsChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  if (selectedSpecies.length === 0) {
    return null;
  }

  const handleChartTypeChange = (event: SelectChangeEvent<"bar" | "line">) => {
    setChartType(event.target.value as "bar" | "line");
  };

  // Calculate per-species data for line chart
  const speciesNames = selectedSpecies.map(
    (species) => species.charAt(0).toUpperCase() + species.slice(1)
  );

  const speciesSavings = selectedSpecies.map((species) => {
    const volume = parseFloat(volumes[species] || "0");
    const avgWeight = AVG_HANGING_WEIGHTS[species];
    const heads = calculateHeads(volume, avgWeight);
    return calculateLaborValue(
      heads,
      parseFloat(timePerAnimal),
      parseFloat(hourlyWage)
    );
  });

  const speciesCosts = selectedSpecies.map((species) => {
    const volume = parseFloat(volumes[species] || "0");
    return volume * COST_PER_LB;
  });

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Savings vs Costs Comparison</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={handleChartTypeChange}
          >
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="line">Line Chart</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: "100%", height: 350 }}>
        {chartType === "bar" && (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: ["Annual Comparison"],
              },
            ]}
            series={[
              {
                data: [savings],
                label: "Total Savings",
                color: "#008C50",
              },
              {
                data: [cost],
                label: "Total Cost",
                color: "#C83232",
              },
              {
                data: [netBenefit],
                label: "Net Benefit",
                color: "#006B3C",
              },
            ]}
            height={350}
          />
        )}

        {chartType === "line" && (
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: speciesNames,
              },
            ]}
            series={[
              {
                data: speciesSavings,
                label: "Savings",
                color: "#008C50",
              },
              {
                data: speciesCosts,
                label: "Cost",
                color: "#C83232",
              },
            ]}
            height={350}
          />
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", gap: 3, justifyContent: "center" }}>
        <Typography variant="body2" color="success.main">
          ► Savings: $
          {savings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Typography variant="body2" color="error.main">
          ► Cost: $
          {cost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Typography variant="body2" sx={{ color: "#006B3C" }}>
          ► Net Benefit: $
          {netBenefit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Box>
    </Paper>
  );
}
