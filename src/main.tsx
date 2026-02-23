import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import FarmProvider from "./context/FarmContext.tsx";
import theme from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <FarmProvider>
        <App />
      </FarmProvider>
    </ThemeProvider>
  </StrictMode>
);
