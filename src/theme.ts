import { alpha, createTheme } from "@mui/material/styles";

const PRIMARY = "#2f7a67";
const SECONDARY = "#d08b3f";
const INK = "#12242b";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: PRIMARY,
      dark: "#245f51",
      light: "#5a9888",
      contrastText: "#ffffff",
    },
    secondary: {
      main: SECONDARY,
      dark: "#a36b2c",
      light: "#e2b274",
      contrastText: "#1f1f1f",
    },
    success: {
      main: "#2f8f52",
    },
    error: {
      main: "#cc4b4d",
    },
    background: {
      default: "#eef2f2",
      paper: "rgba(255, 255, 255, 0.87)",
    },
    text: {
      primary: INK,
      secondary: "#4c6168",
    },
    divider: alpha(INK, 0.14),
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      '"Manrope", "Plus Jakarta Sans", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 780,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 720,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 680,
      letterSpacing: "-0.01em",
    },
    button: {
      fontWeight: 650,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.9) 0%, rgba(249,252,251,0.86) 100%)",
          border: `1px solid ${alpha(INK, 0.11)}`,
          boxShadow:
            "0 16px 40px rgba(10, 18, 24, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(6px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(INK, 0.11)}`,
          boxShadow: "0 10px 24px rgba(12, 20, 28, 0.12)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "transform 160ms ease, box-shadow 160ms ease",
        },
        contained: {
          boxShadow: "0 8px 18px rgba(21, 49, 58, 0.24)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9,
          backgroundColor: alpha(PRIMARY, 0.12),
          border: `1px solid ${alpha(PRIMARY, 0.24)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.7),
          borderRadius: 10,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
