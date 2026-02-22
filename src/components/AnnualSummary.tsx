import { Alert, Box, Stack, Paper, Typography } from "@mui/material";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";

interface AnnualSummaryProps {
  totalAnnualVolume: number;
  totalAnnualSavings: number;
  totalAnnualCost: number;
  hasErrors: boolean;
}

export const AnnualSummary = ({
  totalAnnualVolume,
  totalAnnualSavings,
  totalAnnualCost,
  hasErrors,
}: AnnualSummaryProps) => {
  const netAnnualBenefit = totalAnnualSavings - totalAnnualCost;
  const formatCurrency = (value: number): string =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <ShowChartOutlinedIcon color="primary" />
        <Typography variant="h5" gutterBottom>
          Annual Summary
        </Typography>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 0.5, sm: 1.5 },
            mb: 1.5,
            pb: 1.25,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="body1">Total Annual Volume:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalAnnualVolume.toLocaleString()} lbs
          </Typography>
        </Box>
        {hasErrors && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Resolve invalid values to ensure reliable projections.
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 0.5, sm: 1.5 },
            mb: 2,
            p: 1.25,
            borderRadius: 2,
            bgcolor: "rgba(47,143,82,0.08)",
            border: "1px solid rgba(47,143,82,0.2)",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" color="success.main">
            Total Annual Savings:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            ${formatCurrency(totalAnnualSavings)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 0.5, sm: 1.5 },
            mb: 2,
            p: 1.25,
            borderRadius: 2,
            bgcolor: "rgba(204,75,77,0.08)",
            border: "1px solid rgba(204,75,77,0.2)",
          }}
        >
          <Typography variant="body1" color="error.main">
            Total Annual Cost:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            ${formatCurrency(totalAnnualCost)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 0.5, sm: 1.5 },
            p: 1.5,
            borderRadius: 2,
            bgcolor: "rgba(47,122,103,0.08)",
            border: "1px solid rgba(47,122,103,0.24)",
          }}
        >
          <Typography variant="h6">Net Annual Benefit:</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary" sx={{ wordBreak: "break-word" }}>
            ${formatCurrency(netAnnualBenefit)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
