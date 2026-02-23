import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CustomButton from "./ui/CustomButton";

interface EmptyProps {
  heading: string;
  description: string;
  btnLink: string;
  btnText: string;
}

const Empty = ({ heading, description, btnLink, btnText }: EmptyProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: { xs: "calc(100vh - 200px)", sm: "calc(100vh - 255px)" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          height: "50%",
          width: { xs: "100%", sm: "80%", md: "50%", lg: "30%" },
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 3, sm: 4 },
          borderRadius: { xs: "8px", sm: "12px" },
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
          <Inventory2Icon sx={{ fontSize: { xs: 32, sm: 40 } }} />
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            my: 2,
            fontFamily: "roca",
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {heading}
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "11px", sm: "12px" },
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>

        <Box sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}>
          <CustomButton variant="orange" onClick={() => navigate(`/${btnLink}`)}>
            {btnText}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Empty;
