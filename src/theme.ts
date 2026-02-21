import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    farmGreen: Palette["primary"];
    farmOrange: Palette["primary"];
    farmGray: Palette["primary"];
  }
  interface PaletteOptions {
    farmGreen?: PaletteOptions["primary"];
    farmOrange?: PaletteOptions["primary"];
    farmGray?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    farmGreen: true;
    farmOrange: true;
    farmGray: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    text: {
      primary: "#45403d",
      secondary: "#6a6664",
    },
    farmGreen: {
      main: "#016F35",
      light: "#b3d4c2",
      contrastText: "#fff",
    },
    farmOrange: {
      main: "#FF7C01",
      light: "#ffcb99",
      contrastText: "#fff",
    },
    farmGray: {
      main: "#45403d",
      contrastText: "#fff",
    },
  },
});

export default theme;
