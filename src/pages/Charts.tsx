import { Box, Typography } from "@mui/material";

export default function Charts() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, mb: 1, fontFamily: "roca" }}
      >
        Charts & Analytics
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, fontWeight: 500, fontSize: "14px" }}
      >
        Visualize your data with interactive charts
      </Typography>
    </Box>
  );
}
