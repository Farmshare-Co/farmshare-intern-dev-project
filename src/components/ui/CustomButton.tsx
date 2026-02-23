import { Button } from "@mui/material";
import type { ReactNode } from "react";

interface CustomButtonProps {
  variant: "green" | "orange" | "outlined";
  children: ReactNode;
  onClick?: () => void;
  startIcon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  active?: boolean; // For toggle buttons (opacity control)
  type?: "button" | "submit";
  size?: "small" | "medium"; // small = compact, medium = full padding
}

export default function CustomButton({
  variant,
  children,
  onClick,
  startIcon,
  fullWidth = false,
  disabled = false,
  active = true,
  type = "button",
  size = "medium",
}: CustomButtonProps) {
  const baseStyles = {
    textTransform: "none" as const,
    borderRadius: 2,
    fontWeight: 600,
    paddingX: size === "small" ? undefined : { xs: 2, sm: 3 },
    paddingY: size === "small" ? undefined : 1,
    fontSize: size === "small" ? undefined : { xs: "0.875rem", sm: "1rem" },
    width: fullWidth ? "100%" : { xs: "100%", sm: "auto" },
    boxShadow: "none",
  };

  const variantStyles = {
    green: {
      backgroundColor: "farmGreen.main",
      color: "#fff",
      opacity: active ? 1 : 0.6,
      "&:hover": {
        backgroundColor: "farmGreen.main",
        boxShadow: "none",
        opacity: 1,
      },
    },
    orange: {
      backgroundColor: "farmOrange.main",
      color: "#fff",
      opacity: active ? 1 : 0.6,
      "&:hover": {
        backgroundColor: "farmOrange.main",
        boxShadow: "none",
        opacity: 1,
      },
    },
    outlined: {
      borderColor: "#e0e0e0",
      color: "text.secondary",
      "&:hover": {
        borderColor: "farmOrange.main",
        backgroundColor: "rgba(255, 124, 1, 0.05)",
      },
    },
  };

  return (
    <Button
      variant={variant === "outlined" ? "outlined" : "contained"}
      onClick={onClick}
      startIcon={startIcon}
      disabled={disabled}
      type={type}
      sx={{
        ...baseStyles,
        ...variantStyles[variant],
      }}
    >
      {children}
    </Button>
  );
}
