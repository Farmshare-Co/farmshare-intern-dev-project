import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

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
          {heading}
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "12px",
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(`/${btnLink}`)}
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
          {btnText}
        </Button>
      </Box>
    </Box>
  );
};

export default Empty;
