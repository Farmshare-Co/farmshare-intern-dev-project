import { useState } from "react";
import { TextField, Paper, Typography, Box, IconButton, Collapse } from "@mui/material";
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
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <main>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Advanced Settings
                </Typography>
                <IconButton
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    sx={{
                        transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            <Paper>
                <Collapse in={showAdvanced}>
                    <TextField
                        fullWidth
                        label="Time Savings per Animal (minutes)"
                        type="number"
                        value={timePerAnimal}
                        onChange={(e) => onTimeChange(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Average Hourly Wage ($)"
                        type="number"
                        value={hourlyWage}
                        onChange={(e) => onWageChange(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Collapse>
            </Paper>

        </main >
    )
}