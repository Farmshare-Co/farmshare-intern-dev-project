import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { FarmContext } from "../context/FarmContext";
import SavingsChart from "../components/SavingsChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function Charts() {
  const {
    selectedSpecies,
    volumes,
    timePerAnimal,
    hourlyWage,
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  const navigate = useNavigate();
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
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1, fontFamily: "roca" }}
          >
            Charts & Analytics
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: "14px" }}
          >
            Visualize your savings and costs with interactive charts
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={() => setViewMode("annual")}
            sx={{
              backgroundColor: "farmGreen.main",
              color: "#fff",
              paddingX: 3,
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
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
              paddingX: 3,
              paddingY: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
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
        <Box
          sx={{
            minHeight: "calc(100vh - 255px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              height: "50%",
              width: "30%",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 4,
              borderRadius: "12px",
              justifyContent: "center",
              border: "2px dashed #e0e0e0",
            }}
          >
            <Box
              sx={{
                bgcolor: "#fafafa",
                padding: "10px",
                paddingBottom: "4px",
                borderRadius: "10px",
              }}
            >
              <Inventory2Icon />
            </Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, my: 2, fontFamily: "roca" }}
            >
              No charts to display
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "12px",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              In order for you to see the charts, please select at least on
              species from the Calculator page.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/calculator")}
              sx={{
                backgroundColor: "farmOrange.main",
                color: "#fff",
                paddingX: 3,
                paddingY: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                mt: 3,
                "&:hover": {
                  backgroundColor: "farmOrange.main",
                  boxShadow: "none",
                  opacity: 1,
                },
              }}
            >
              Value Calculator
            </Button>
          </Box>
        </Box>
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
