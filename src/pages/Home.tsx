import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Value Calculator",
      description:
        "Calculate annual savings and costs for your meat processing operation",
      icon: <CalculateIcon sx={{ fontSize: 40, color: "text.primary" }} />,
      path: "/calculator",
    },
    {
      title: "Comparisons",
      description:
        "Compare different scenarios and species mixes to optimize profitability",
      icon: <CompareArrowsIcon sx={{ fontSize: 40, color: "text.primary" }} />,
      path: "/comparisons",
    },
    {
      title: "Charts",
      description: "Visualize your data with interactive charts and graphs",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "text.primary" }} />,
      path: "/charts",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 600, mb: 1, fontFamily: "roca" }}
      >
        Welcome to Farmshare
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 4, fontWeight: 500, fontSize: "14px" }}
      >
        Your comprehensive meat processor value calculator
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            sx={{
              height: "100%",
              display: "flex",
              borderRadius: 3,
              px: 1,
              py: 0.25,
              boxShadow: "none",
              border: "2px solid #e0e0e0",
              flexDirection: "column",
              transition: "all 0.3s ease",
              backgroundColor: "#fff",
              "&:hover": {
                // transform: "translateY(-4px)",
                background:
                  "linear-gradient(135deg, rgba(255, 124, 1, 0.03) 0%, rgba(255, 255, 255, 100) 100%)",
                // borderColor: "farmOrange.main",
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                pb: 0,
                "&:last-child": {
                  paddingBottom: "14px",
                },
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontFamily: "roca",
                  color: "farmGreen.main",
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 2, fontSize: "14px", fontWeight: 500 }}
              >
                {feature.description}
              </Typography>
              <Button
                variant="contained"
                color="farmGreen"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "farmOrange.main",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
                onClick={() => navigate(feature.path)}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
