import { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import { FarmContext } from "../context/FarmContext";
import SavingsChart from "../components/SavingsChart";
import Empty from "../components/Empty";
import CustomButton from "../components/ui/CustomButton";

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
          <CustomButton
            variant="green"
            onClick={() => setViewMode("annual")}
            active={viewMode === "annual"}
          >
            Annual
          </CustomButton>
          <CustomButton
            variant="orange"
            onClick={() => setViewMode("monthly")}
            active={viewMode === "monthly"}
          >
            Monthly
          </CustomButton>
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
