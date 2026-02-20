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
} from "@mui/material";
import type { EAnimalSpecies } from "../types";

interface BeforeAfterComparisonProps {
  selectedSpecies: EAnimalSpecies[];
  withPlatformSavings: number;
  withPlatformCost: number;
  withPlatformBenefit: number;
}

export default function BeforeAfterComparison({
  selectedSpecies,
  withPlatformSavings,
  withPlatformCost,
  withPlatformBenefit,
}: BeforeAfterComparisonProps) {
  if (selectedSpecies.length === 0) {
    return null;
  }

  // Before platform: no savings, no cost
  const beforeSavings = 0;
  const beforeCost = 0;
  const beforeBenefit = 0;

  // Calculate differences
  const savingsDiff = withPlatformSavings - beforeSavings;
  const costDiff = withPlatformCost - beforeCost;
  const benefitDiff = withPlatformBenefit - beforeBenefit;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Before vs After Farmshare Comparison
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        See the financial impact of using FarmShare platform
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="left">
                <strong>Metric</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Before Farmshare</strong>
              </TableCell>
              <TableCell align="center">
                <strong>With Farmshare</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Difference</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Annual Time Savings</TableCell>
              <TableCell align="center" sx={{ color: "text.secondary" }}>
                $0.00
              </TableCell>
              <TableCell align="center" sx={{ color: "success.main" }}>
                ${withPlatformSavings.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                +${savingsDiff.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Annual Platform Cost</TableCell>
              <TableCell align="center" sx={{ color: "text.secondary" }}>
                $0.00
              </TableCell>
              <TableCell align="center" sx={{ color: "error.main" }}>
                ${withPlatformCost.toFixed(2)}
              </TableCell>
              <TableCell align="center" sx={{ color: "error.main" }}>
                -${costDiff.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f0f9f4" }}>
              <TableCell>
                <strong>Net Annual Benefit</strong>
              </TableCell>
              <TableCell align="center" sx={{ color: "text.secondary" }}>
                <strong>$0.00</strong>
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#006B3C", fontWeight: "bold" }}
              >
                ${withPlatformBenefit.toFixed(2)}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#006B3C",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                +${benefitDiff.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, backgroundColor: "#e8f5e9", borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: "#2e7d32" }}>
          <strong>ROI Analysis:</strong> By using FarmShare, you save{" "}
          <strong>${withPlatformSavings.toFixed(2)}</strong> in labor costs
          while paying only <strong>${withPlatformCost.toFixed(2)}</strong> for
          the platform, resulting in a net benefit of{" "}
          <strong>${withPlatformBenefit.toFixed(2)}</strong> annually.
        </Typography>
      </Box>
    </Paper>
  );
}
