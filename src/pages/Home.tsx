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
      icon: <CalculateIcon sx={{ fontSize: 40, color: "farmGreen.main" }} />,
      path: "/calculator",
    },
    {
      title: "Comparisons",
      description:
        "Compare different scenarios and species mixes to optimize profitability",
      icon: (
        <CompareArrowsIcon sx={{ fontSize: 40, color: "farmOrange.main" }} />
      ),
      path: "/comparisons",
    },
    {
      title: "Charts & Analytics",
      description: "Visualize your data with interactive charts and graphs",
      icon: <BarChartIcon sx={{ fontSize: 40, color: "farmGray.main" }} />,
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
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              <Button
                variant="outlined"
                color="farmGreen"
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
