import { createTheme } from "@mui/material";

const farmshareTheme = createTheme({
  palette: {
    primary: {
      main: "#016f35",
      light: "#52B788",
      dark: "#1B3D2A",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h4: { fontWeight: 800, letterSpacing: "-0.5px" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px" },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    body2: { fontSize: "0.8125rem" },
  },
  shape: { borderRadius: 10 },
  components: {
  },
});

export default farmshareTheme;