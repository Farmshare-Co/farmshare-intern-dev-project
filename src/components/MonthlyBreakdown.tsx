import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import type { EAnimalSpecies } from "../types";

interface MonthlyBreakdownRow {
  species: EAnimalSpecies;
  annualHeads: number;
  monthlyVolume: number;
  monthlySavings: number;
  monthlyCost: number;
  monthlyNetBenefit: number;
}

interface MonthlyBreakdownProps {
  rows: MonthlyBreakdownRow[];
  monthlyVolume: number;
  monthlySavings: number;
  monthlyCost: number;
  monthlyNetBenefit: number;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatSpeciesLabel = (species: EAnimalSpecies): string =>
  species.charAt(0).toUpperCase() + species.slice(1);

export const MonthlyBreakdown = ({
  rows,
  monthlyVolume,
  monthlySavings,
  monthlyCost,
  monthlyNetBenefit,
}: MonthlyBreakdownProps) => {
  const summaryItems = [
    {
      key: "volume",
      label: "Monthly Volume",
      value: `${monthlyVolume.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} lbs`,
      icon: <ScaleOutlinedIcon fontSize="small" />,
      bgColor: "rgba(77,142,120,0.12)",
      borderColor: "rgba(57,126,103,0.24)",
    },
    {
      key: "savings",
      label: "Monthly Savings",
      value: `$${formatCurrency(monthlySavings)}`,
      icon: <SavingsOutlinedIcon fontSize="small" />,
      bgColor: "rgba(47,143,82,0.12)",
      borderColor: "rgba(47,143,82,0.24)",
    },
    {
      key: "cost",
      label: "Monthly Cost",
      value: `$${formatCurrency(monthlyCost)}`,
      icon: <PaymentsOutlinedIcon fontSize="small" />,
      bgColor: "rgba(204,75,77,0.12)",
      borderColor: "rgba(204,75,77,0.24)",
    },
    {
      key: "net",
      label: "Monthly Net",
      value: `$${formatCurrency(monthlyNetBenefit)}`,
      icon: <TrendingUpOutlinedIcon fontSize="small" />,
      bgColor: "rgba(53,80,112,0.14)",
      borderColor: "rgba(53,80,112,0.24)",
    },
  ];

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <CalendarMonthOutlinedIcon color="primary" />
        <Typography variant="h5" gutterBottom>
          Monthly Breakdown
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        {summaryItems.map((item) => (
          <Box
            key={item.key}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: item.bgColor,
              border: `1px solid ${item.borderColor}`,
              transition: "transform 160ms ease, box-shadow 160ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 22px rgba(11,21,31,0.12)",
              },
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ color: "text.secondary", display: "inline-flex" }}>{item.icon}</Box>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Stack>
            <Typography variant="h6">{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: { xs: "grid", md: "none" },
          gap: 1.25,
        }}
      >
        {rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No species selected.
          </Typography>
        ) : (
          rows.map((row) => (
            <Box
              key={row.species}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(18,36,43,0.1)",
                bgcolor: "rgba(255,255,255,0.45)",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
                {formatSpeciesLabel(row.species)}
              </Typography>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Annual Heads: {row.annualHeads.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Volume:{" "}
                  {row.monthlyVolume.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Savings: ${formatCurrency(row.monthlySavings)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Cost: ${formatCurrency(row.monthlyCost)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Net: ${formatCurrency(row.monthlyNetBenefit)}
                </Typography>
              </Stack>
            </Box>
          ))
        )}
      </Box>

      <TableContainer
        sx={{
          display: { xs: "none", md: "block" },
          borderRadius: 2,
          border: "1px solid rgba(18,36,43,0.1)",
          overflowX: "auto",
        }}
      >
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(47,122,103,0.08)" }}>
              <TableCell>Species</TableCell>
              <TableCell align="right">Annual Heads</TableCell>
              <TableCell align="right">Monthly Volume</TableCell>
              <TableCell align="right">Monthly Savings</TableCell>
              <TableCell align="right">Monthly Cost</TableCell>
              <TableCell align="right">Monthly Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No species selected.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.species}>
                  <TableCell>{formatSpeciesLabel(row.species)}</TableCell>
                  <TableCell align="right">
                    {row.annualHeads.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {row.monthlyVolume.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell align="right">
                    ${formatCurrency(row.monthlySavings)}
                  </TableCell>
                  <TableCell align="right">${formatCurrency(row.monthlyCost)}</TableCell>
                  <TableCell align="right">
                    ${formatCurrency(row.monthlyNetBenefit)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
