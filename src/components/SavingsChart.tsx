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
  viewMode: "annual" | "monthly";
}

export default function SavingsChart({
  selectedSpecies,
  volumes,
  timePerAnimal,
  hourlyWage,
  savings,
  cost,
  netBenefit,
  viewMode,
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
    const annualValue = calculateLaborValue(
      heads,
      parseFloat(timePerAnimal),
      parseFloat(hourlyWage)
    );
    return viewMode === "monthly" ? annualValue / 12 : annualValue;
  });

  const speciesCosts = selectedSpecies.map((species) => {
    const volume = parseFloat(volumes[species] || "0");
    const annualCost = volume * COST_PER_LB;
    return viewMode === "monthly" ? annualCost / 12 : annualCost;
  });

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        mt: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: "none",
        border: "2px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "roca",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Savings vs Costs Comparison
        </Typography>
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 150 },
          }}
        >
          <InputLabel sx={{ fontSize: "12px", mt: "4px" }}>
            Chart Type
          </InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={handleChartTypeChange}
            sx={{ fontSize: "12px", fontWeight: 500 }}
          >
            <MenuItem value="bar" sx={{ fontSize: "14px", fontWeight: 500 }}>
              Bar Chart
            </MenuItem>
            <MenuItem value="line" sx={{ fontSize: "14px", fontWeight: 500 }}>
              Line Chart
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          width: "100%",
        }}
      >
        {chartType === "bar" && (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: [
                  viewMode === "annual"
                    ? "Annual Comparison"
                    : "Monthly Comparison",
                ],
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
            height={300}
            slotProps={{
              legend: {
                direction: "row" as const,
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
              },
            }}
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
            height={300}
            slotProps={{
              legend: {
                direction: "row" as const,
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
              },
            }}
          />
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", gap: 3, justifyContent: "center" }}>
        <Typography
          variant="body2"
          color="success.main"
          sx={{
            fontSize: { xs: "10px", lg: "14px" },
            bgcolor: "#fafafa",
            padding: "10px",
            borderRadius: "8px",
            border: "1px dashed #e0e0e0",
            textAlign: "center",
          }}
        >
          Savings: $
          {savings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Typography
          variant="body2"
          color="error.main"
          sx={{
            fontSize: { xs: "10px", lg: "14px" },
            bgcolor: "#fafafa",
            padding: "10px",
            borderRadius: "8px",
            border: "1px dashed #e0e0e0",
            textAlign: "center",
          }}
        >
          Cost: $
          {cost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#006B3C",
            fontSize: { xs: "10px", lg: "14px" },
            bgcolor: "#fafafa",
            padding: "10px",
            borderRadius: "8px",
            border: "1px dashed #e0e0e0",
            textAlign: "center",
          }}
        >
          Net Benefit: $
          {netBenefit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Box>
    </Paper>
  );
}
