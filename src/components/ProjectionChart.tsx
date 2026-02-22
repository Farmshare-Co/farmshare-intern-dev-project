import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import {
  Box,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import type { ProjectionResult } from "../utils/projection";

interface ProjectionChartProps {
  projection: ProjectionResult;
}

type ChartView = "annual" | "monthly";

const METRIC_COLORS = {
  savings: "#2d6a4f",
  cost: "#bc4749",
  netBenefit: "#355070",
} as const;

const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const compactCurrencyFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});

const formatCompactCurrency = (value: number): string =>
  compactCurrencyFormatter.format(value);

const formatSpeciesLabel = (species: string): string =>
  species.charAt(0).toUpperCase() + species.slice(1);

export const ProjectionChart = ({ projection }: ProjectionChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chartView, setChartView] = useState<ChartView>("annual");
  const annualDataset = useMemo(
    () => [
      {
        metric: "Savings",
        value: projection.totals.annualSavings,
        color: METRIC_COLORS.savings,
      },
      {
        metric: "Cost",
        value: projection.totals.annualCost,
        color: METRIC_COLORS.cost,
      },
      {
        metric: "Net Benefit",
        value: projection.totals.annualNetBenefit,
        color: METRIC_COLORS.netBenefit,
      },
    ],
    [
      projection.totals.annualSavings,
      projection.totals.annualCost,
      projection.totals.annualNetBenefit,
    ],
  );

  const monthlyDataset = useMemo(
    () =>
      projection.rows.map((row) => ({
        species: formatSpeciesLabel(row.species),
        savings: row.monthlySavings,
        cost: row.monthlyCost,
        netBenefit: row.monthlyNetBenefit,
      })),
    [projection.rows],
  );

  const handleChartViewChange = (
    _event: MouseEvent<HTMLElement>,
    nextView: ChartView | null,
  ) => {
    if (nextView) {
      setChartView(nextView);
    }
  };

  const annualHeight = isMobile ? 260 : 320;
  const monthlyHeight = isMobile ? 300 : 360;
  const annualMargin = isMobile
    ? { top: 20, right: 8, bottom: 28, left: 52 }
    : { top: 40, right: 20, bottom: 35, left: 90 };
  const monthlyMargin = isMobile
    ? { top: 20, right: 8, bottom: 28, left: 52 }
    : { top: 30, right: 20, bottom: 35, left: 90 };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <QueryStatsOutlinedIcon color="primary" />
            <Typography variant="h5" gutterBottom>
              Projection Chart
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {chartView === "annual"
              ? "Annual savings, cost, and net benefit in USD."
              : "Monthly savings, cost, and net benefit by species in USD."}
          </Typography>
        </Box>
        <ToggleButtonGroup
          size={isMobile ? "medium" : "small"}
          exclusive
          value={chartView}
          onChange={handleChartViewChange}
          aria-label="projection chart view"
          sx={{
            width: { xs: "100%", sm: "auto" },
            "& .MuiToggleButton-root": {
              px: 1.5,
              flex: { xs: 1, sm: "none" },
              borderColor: "rgba(18,36,43,0.2)",
              color: "text.secondary",
            },
            "& .MuiToggleButton-root.Mui-selected": {
              bgcolor: "rgba(47,122,103,0.18)",
              color: "primary.dark",
            },
          }}
        >
          <ToggleButton value="annual">Annual Totals</ToggleButton>
          <ToggleButton value="monthly">Monthly by Species</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {chartView === "annual" ? (
        <BarChart
          dataset={annualDataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "metric",
            },
          ]}
          yAxis={[
            {
              valueFormatter: (value: number | null) =>
                typeof value === "number" ? formatCompactCurrency(value) : "",
            },
          ]}
          series={[
            {
              dataKey: "value",
              label: "Annual Value",
              valueFormatter: (value: number | null) =>
                value == null ? "" : `$${formatCurrency(value)}`,
              colorGetter: ({ dataIndex }) =>
                annualDataset[dataIndex]?.color ?? METRIC_COLORS.savings,
              barLabel: isMobile
                ? undefined
                : (item) =>
                    item.value == null ? null : formatCompactCurrency(item.value),
              barLabelPlacement: "outside",
            },
          ]}
          grid={{ horizontal: true }}
          hideLegend
          height={annualHeight}
          margin={annualMargin}
          sx={{
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: "rgba(0,0,0,0.35)",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "rgba(0,0,0,0.75)",
              fontSize: isMobile ? 11 : 12,
            },
            "& .MuiChartsGrid-horizontalLine": {
              strokeDasharray: "4 4",
              stroke: "rgba(0,0,0,0.12)",
            },
            "& .MuiBarLabel-root": {
              fill: "rgba(0,0,0,0.78)",
              fontSize: 11,
              fontWeight: 600,
            },
          }}
        />
      ) : monthlyDataset.length > 0 ? (
        <BarChart
          dataset={monthlyDataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "species",
            },
          ]}
          yAxis={[
            {
              valueFormatter: (value: number | null) =>
                typeof value === "number" ? formatCompactCurrency(value) : "",
            },
          ]}
          series={[
            {
              dataKey: "savings",
              label: "Monthly Savings",
              color: METRIC_COLORS.savings,
              valueFormatter: (value: number | null) =>
                value == null ? "" : `$${formatCurrency(value)}`,
            },
            {
              dataKey: "cost",
              label: "Monthly Cost",
              color: METRIC_COLORS.cost,
              valueFormatter: (value: number | null) =>
                value == null ? "" : `$${formatCurrency(value)}`,
            },
            {
              dataKey: "netBenefit",
              label: "Monthly Net Benefit",
              color: METRIC_COLORS.netBenefit,
              valueFormatter: (value: number | null) =>
                value == null ? "" : `$${formatCurrency(value)}`,
            },
          ]}
          grid={{ horizontal: true }}
          height={monthlyHeight}
          margin={monthlyMargin}
          sx={{
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: "rgba(0,0,0,0.35)",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "rgba(0,0,0,0.75)",
              fontSize: isMobile ? 11 : 12,
            },
            "& .MuiChartsGrid-horizontalLine": {
              strokeDasharray: "4 4",
              stroke: "rgba(0,0,0,0.12)",
            },
          }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Add species volumes to view monthly chart details.
        </Typography>
      )}
    </Paper>
  );
};
