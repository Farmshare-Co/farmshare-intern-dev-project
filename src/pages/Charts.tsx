import { useContext, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FarmContext } from "../context/FarmContext";
import SavingsChart from "../components/SavingsChart";
import Empty from "../components/Empty";

export default function Charts() {
  const {
    selectedSpecies,
    volumes,
    timePerAnimal,
    hourlyWage,
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");

  const getDisplaySavings = () => {
    const annual = calculateTotalAnnualSavings();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  const getDisplayCost = () => {
    const annual = calculateTotalAnnualCost();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  const getDisplayBenefit = () => {
    const annual = calculateTotalAnnualSavings() - calculateTotalAnnualCost();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 1,
              fontFamily: "roca",
              fontSize: { xs: "1.5rem", sm: "2.125rem" },
            }}
          >
            Charts & Analytics
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Visualize your savings and costs with interactive charts
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => setViewMode("annual")}
            sx={{
              backgroundColor: "farmGreen.main",
              color: "#fff",
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              opacity: viewMode === "annual" ? 1 : 0.6,
              "&:hover": {
                backgroundColor: "farmGreen.main",
                boxShadow: "none",
                opacity: 1,
              },
            }}
          >
            Annual
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewMode("monthly")}
            sx={{
              backgroundColor: "farmOrange.main",
              color: "#fff",
              paddingX: { xs: 2, sm: 3 },
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              opacity: viewMode === "monthly" ? 1 : 0.6,
              "&:hover": {
                backgroundColor: "farmOrange.main",
                boxShadow: "none",
                opacity: 1,
              },
            }}
          >
            Monthly
          </Button>
        </Box>
      </Box>

      {selectedSpecies.length === 0 ? (
        <Empty
          heading="No charts to display"
          description="In order for you to see the charts, please select at least one species from the Calculator page."
          btnLink="calculator"
          btnText="Value Calculator"
        />
      ) : (
        <Box sx={{ mb: 3, borderRadius: 3 }}>
          <SavingsChart
            selectedSpecies={selectedSpecies}
            volumes={volumes}
            timePerAnimal={timePerAnimal}
            hourlyWage={hourlyWage}
            savings={getDisplaySavings()}
            cost={getDisplayCost()}
            netBenefit={getDisplayBenefit()}
            viewMode={viewMode}
          />
        </Box>
      )}
    </Box>
  );
}
