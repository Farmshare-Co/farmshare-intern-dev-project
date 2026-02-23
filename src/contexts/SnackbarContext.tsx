import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";

interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("Bad Snackbar");
  return ctx;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message: string, severity: AlertColor = "success") => {
    setSnackbar({ open: false, message, severity });
    setTimeout(() => setSnackbar({ open: true, message, severity }), 50);
  }, []);

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", minWidth: 280 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
