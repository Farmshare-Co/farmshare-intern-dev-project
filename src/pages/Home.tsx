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
      icon: (
        <CalculateIcon
          sx={{ fontSize: { xs: 32, sm: 40 }, color: "text.primary" }}
        />
      ),
      path: "/calculator",
    },
    {
      title: "Comparisons",
      description:
        "Compare different scenarios and species mixes to optimize profitability",
      icon: (
        <CompareArrowsIcon
          sx={{ fontSize: { xs: 32, sm: 40 }, color: "text.primary" }}
        />
      ),
      path: "/comparisons",
    },
    {
      title: "Charts",
      description: "Visualize your data with interactive charts and graphs",
      icon: (
        <BarChartIcon
          sx={{ fontSize: { xs: 32, sm: 40 }, color: "text.primary" }}
        />
      ),
      path: "/charts",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 1,
          fontFamily: "roca",
          fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        Welcome to Farmshare
      </Typography>
      <Typography
        color="text.secondary"
        sx={{
          mb: { xs: 3, sm: 4 },
          fontWeight: 500,
          fontSize: { xs: "13px", sm: "14px" },
        }}
      >
        Your comprehensive meat processor value calculator
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            sx={{
              height: "100%",
              display: "flex",
              borderRadius: { xs: 2, md: 3 },
              px: { xs: 0.5, sm: 1 },
              py: { xs: 0.15, sm: 0.25 },
              boxShadow: "none",
              border: "2px solid #e0e0e0",
              flexDirection: "column",
              transition: "all 0.3s ease",
              backgroundColor: "#fff",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(255, 124, 1, 0.03) 0%, rgba(255, 255, 255, 100) 100%)",
              },
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                pb: 0,
                px: { xs: 2, sm: 2.5 },
                pt: { xs: 2, sm: 2.5 },
                display: "flex",
                flexDirection: "column",
                "&:last-child": {
                  paddingBottom: { xs: "12px", sm: "14px" },
                },
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>{feature.icon}</Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontFamily: "roca",
                    color: "farmGreen.main",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                color="farmGreen"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "farmOrange.main",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  py: { xs: 1, sm: 1.25 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
