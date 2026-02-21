import { useState } from "react";
import { TextField, Box, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AdvancedSettingsProps {
    timePerAnimal: string;
    hourlyWage: string;
    onTimeChange: (value: string) => void;
    onWageChange: (value: string) => void;
}

export default function AdvancedSettings({
    timePerAnimal,
    hourlyWage,
    onTimeChange,
    onWageChange,
}: AdvancedSettingsProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="card">
            <div className="card__body" style={{ paddingBottom: open ? 24 : 4 }}>
                <div className="advanced-toggle" onClick={() => setOpen((prev) => !prev)}>
                    <span className="advanced-toggle__label">
                        Advanced Settings — Labor &amp; Wage
                    </span>
                    <IconButton
                        size="small"
                        sx={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                        }}
                    >
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </div>

                <Collapse in={open}>
                    <div className="advanced-divider" />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Time Savings per Animal (minutes)"
                            type="number"
                            value={timePerAnimal}
                            onChange={(e) => onTimeChange(e.target.value)}
                            size="small"
                            helperText="Time saved per animal using Farmshare"
                        />
                        <TextField
                            fullWidth
                            label="Average Hourly Wage ($)"
                            type="number"
                            value={hourlyWage}
                            onChange={(e) => onWageChange(e.target.value)}
                            size="small"
                            helperText="Staff hourly wage at your facility"
                        />
                    </Box>
                </Collapse>
            </div>
        </div>
    );
}
