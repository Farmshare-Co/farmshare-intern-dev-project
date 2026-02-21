import { Paper, Box, Typography } from "@mui/material";

interface AnnualSummaryProps {
    totalVolume: number;
    totalSavings: number;
    totalCost: number;
}

export default function AnnualSummary({
    totalVolume,
    totalSavings,
    totalCost,
}: AnnualSummaryProps) {
    const netBenefit = totalSavings - totalCost;
    const netIsNegative = netBenefit < 0;
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
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
                    <Typography variant="body1">Total Annual Volume:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {totalVolume.toLocaleString()} lbs
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
                    <Typography variant="body1" color="success.main">
                        Total Annual Savings:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                        $
                        {totalSavings.toLocaleString()}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >
                    <Typography variant="body1" color="error.main">
                        Total Annual Cost:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="error.main">
                        $
                        {totalCost.toLocaleString()}
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
                    <Typography variant="h6">Net Annual Benefit:</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        {netIsNegative ? "−" : "+"}${Math.abs(netBenefit).toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}