import { useContext, useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Collapse,
  IconButton,
  OutlinedInput,
  Chip,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckIcon from "@mui/icons-material/Check";
import type { SelectChangeEvent } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { EAnimalSpecies } from "../types";
import {
  EAnimalSpecies as AnimalSpecies,
  AVG_HANGING_WEIGHTS,
  SPECIES_EMOJIS,
} from "../types";
import { exportCSV } from "../utils/exportCSV";
import { exportPDF } from "../utils/exportPDF";
import { FarmContext } from "../context/FarmContext";
import CustomButton from "../components/ui/CustomButton";
// import BeforeAfterComparison from "../components/BeforeAfterComparison";

export default function Calculator() {
  const {
    selectedSpecies,
    setSelectedSpecies,
    volumes,
    setVolumes,
    showAdvanced,
    setShowAdvanced,
    timePerAnimal,
    setTimePerAnimal,
    hourlyWage,
    setHourlyWage,
    getTotalVolume,
    calculateTotalAnnualSavings,
    calculateTotalAnnualCost,
  } = useContext(FarmContext);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");
  const [presetMenuAnchor, setPresetMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // custom presets state are loaded from localStorage
  interface CustomPreset {
    name: string;
    species: EAnimalSpecies[];
    volumes: Record<EAnimalSpecies, string>;
  }

  const getCustomPresets = (): CustomPreset[] => {
    const saved = localStorage.getItem("farmshare-custom-presets");
    return saved ? JSON.parse(saved) : [];
  };

  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(
    getCustomPresets()
  );

  const handleSpeciesChange = (event: SelectChangeEvent<EAnimalSpecies[]>) => {
    const value = event.target.value;
    const species = typeof value === "string" ? value.split(",") : value;
    setSelectedSpecies(species as EAnimalSpecies[]);
  };

  const handleVolumeChange = (species: EAnimalSpecies, value: string) => {
    setVolumes((prev) => ({ ...prev, [species]: value }));
  };

  const hasEmptyVolumes = () => {
    return selectedSpecies.some(
      (species) => !volumes[species] || volumes[species].trim() === ""
    );
  };

  const handleValidationErrors = () => {
    // check for invalid volume
    const hasInvalidVolume = selectedSpecies.some((species) => {
      const volume = +volumes[species];
      return volume < 0 || volume > 10000000;
    });

    // check if hourly wage isn't valid
    const hasInvalidWage = +hourlyWage < 1 || +hourlyWage > 200;

    // check for invalid timeForAnimal
    const hasInvalidTime = +timePerAnimal < 1 || +timePerAnimal > 480;

    return hasInvalidVolume || hasInvalidWage || hasInvalidTime;
  };

  const handleClearAll = () => {
    setClearDialogOpen(true);
  };

  // preset config
  const presets = {
    none: { species: [], volumes: {} },
    beefFocused: {
      species: ["beef" as EAnimalSpecies],
      volumes: { beef: "10000" },
    },
    mixedOperation: {
      species: [
        "beef" as EAnimalSpecies,
        "lamb" as EAnimalSpecies,
        "hog" as EAnimalSpecies,
      ],
      volumes: { beef: "5000", lamb: "2000", hog: "1500" },
    },
    smallFarm: {
      species: ["lamb" as EAnimalSpecies, "goat" as EAnimalSpecies],
      volumes: { lamb: "500", goat: "300" },
    },
    largeCommercial: {
      species: [
        "beef" as EAnimalSpecies,
        "hog" as EAnimalSpecies,
        "veal" as EAnimalSpecies,
      ],
      volumes: { beef: "20000", hog: "15000", veal: "5000" },
    },
  };

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    // check if its custom preset (starts with "custom-")
    if (value.startsWith("custom-")) {
      const customPresetName = value.replace("custom-", "");
      const customPreset = customPresets.find(
        (p) => p.name === customPresetName
      );
      if (customPreset) {
        setSelectedSpecies(customPreset.species);
        setVolumes(customPreset.volumes);
        setSnackbar({
          open: true,
          message: `Preset "${customPreset.name}" applied successfully!`,
          severity: "success",
        });
      }
    } else {
      // handle default presets
      const presetKey = value as keyof typeof presets;
      if (presetKey && presetKey !== "none") {
        const preset = presets[presetKey];
        setSelectedSpecies(preset.species);
        setVolumes(preset.volumes as Record<EAnimalSpecies, string>);
        setSnackbar({
          open: true,
          message: "Preset applied successfully!",
          severity: "success",
        });
      }
    }
  };

  const handleSavePreset = () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before saving a preset.",
        severity: "error",
      });
      return;
    }

    if (!presetName.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a preset name.",
        severity: "error",
      });
      return;
    }

    // check if preset name already exists
    if (customPresets.some((p) => p.name === presetName.trim())) {
      setSnackbar({
        open: true,
        message: "A preset with this name already exists.",
        severity: "error",
      });
      return;
    }

    const newPreset: CustomPreset = {
      name: presetName.trim(),
      species: selectedSpecies,
      volumes: volumes,
    };

    const updatedPresets = [...customPresets, newPreset];
    setCustomPresets(updatedPresets);
    localStorage.setItem(
      "farmshare-custom-presets",
      JSON.stringify(updatedPresets)
    );

    setSnackbar({
      open: true,
      message: `Preset "${presetName.trim()}" saved successfully!`,
      severity: "success",
    });

    setSavePresetDialogOpen(false);
    setPresetName("");
  };

  const handleDeleteCustomPreset = (presetName: string) => {
    const updatedPresets = customPresets.filter((p) => p.name !== presetName);
    setCustomPresets(updatedPresets);
    localStorage.setItem(
      "farmshare-custom-presets",
      JSON.stringify(updatedPresets)
    );

    setSnackbar({
      open: true,
      message: `Preset "${presetName}" deleted successfully!`,
      severity: "success",
    });
  };

  const confirmClearAll = () => {
    setSelectedSpecies([]);
    setVolumes({} as Record<EAnimalSpecies, string>);
    setClearDialogOpen(false);
    setSnackbar({
      open: true,
      message: "All data cleared",
      severity: "success",
    });
  };

  const handleExportCSV = () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before exporting.",
        severity: "error",
      });
      return;
    }

    if (hasEmptyVolumes()) {
      setSnackbar({
        open: true,
        message: "Volume data can't be empty.",
        severity: "error",
      });
      return;
    }

    if (handleValidationErrors()) {
      setSnackbar({
        open: true,
        message: "Please fix validation errors.",
        severity: "error",
      });
      return;
    }

    exportCSV({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
      viewMode,
    });

    setSnackbar({
      open: true,
      message: "CSV exported successfully!",
      severity: "success",
    });
  };

  const handleExportPDF = async () => {
    if (selectedSpecies.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one species before exporting.",
        severity: "error",
      });
      return;
    }

    if (hasEmptyVolumes()) {
      setSnackbar({
        open: true,
        message: "Volume data can't be empty.",
        severity: "error",
      });
      return;
    }

    if (handleValidationErrors()) {
      setSnackbar({
        open: true,
        message: "Please fix validation errors.",
        severity: "error",
      });
      return;
    }

    await exportPDF({
      selectedSpecies,
      volumes,
      timePerAnimal,
      hourlyWage,
      getTotalVolume,
      calculateTotalAnnualSavings,
      calculateTotalAnnualCost,
      viewMode,
    });

    setSnackbar({
      open: true,
      message: "PDF exported successfully!",
      severity: "success",
    });
  };

  const isAnnualHangingInvalid = (species: EAnimalSpecies) => {
    if (+volumes[species] < 0 || +volumes[species] > 10000000) {
      return true;
    } else {
      return false;
    }
  };

  const isHourlyWageValid = +hourlyWage < 1 || +hourlyWage > 200;

  const isTimePerAnimalValid = +timePerAnimal < 1 || +timePerAnimal > 480;

  const getDisplayVolume = () => {
    const annual = getTotalVolume();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  const getDisplaySavings = () => {
    const annual = calculateTotalAnnualSavings();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  const getDisplayCost = () => {
    const annual = calculateTotalAnnualCost();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  const getDisplayBenefit = () => {
    const annual = calculateTotalAnnualSavings() - calculateTotalAnnualCost();
    return viewMode === "monthly" ? annual / 12 : annual;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 3, sm: 4 },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 1,
              fontFamily: "roca",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            Value Calculator
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Calculate annual savings and costs for your meat processing
            operation
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <CustomButton variant="outlined" onClick={handleExportCSV} size="small">
            Export CSV
          </CustomButton>
          <CustomButton variant="outlined" onClick={handleExportPDF} size="small">
            Export PDF
          </CustomButton>
        </Box>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: "none",
          border: "2px solid #e0e0e0",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "flex-end",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "roca",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Meat Processor Value Calculator
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              ml: { xs: 0, sm: "auto" },
              flexDirection: "row",
              padding: { xs: "10px", lg: 0 },
              backgroundColor: { xs: "#fafafa", lg: "transparent" },
              borderRadius: { xs: "8px", lg: 0 },
              border: { xs: "1px dashed #e0e0e0", lg: "none" },
            }}
          >
            <CustomButton
              variant="green"
              startIcon={<SaveIcon />}
              onClick={() => setSavePresetDialogOpen(true)}
              size="small"
            >
              Save
            </CustomButton>

            <CustomButton variant="outlined" onClick={handleClearAll} size="small">
              Clear All
            </CustomButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fafafa",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "farmOrange.main",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "farmGreen.main",
                  borderWidth: 2,
                },
              },
            }}
          >
            <InputLabel sx={{ fontWeight: 500 }}>
              Select Animal Species
            </InputLabel>
            <Select
              multiple
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              input={<OutlinedInput label="Select Animal Species" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value.charAt(0).toUpperCase() + value.slice(1)}
                      onDelete={() => {
                        setSelectedSpecies(
                          selectedSpecies.filter((spec) => spec !== value)
                        );
                      }}
                      deleteIcon={
                        <div
                          role="button"
                          aria-label="Remove"
                          onMouseDown={(e) => e.stopPropagation()}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <CancelIcon />
                        </div>
                      }
                      sx={{
                        backgroundColor: "farmGreen.main",
                        color: "#fff",
                        fontWeight: 600,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "farmGreen.main",
                          transform: "scale(1.02)",
                        },
                        "& .MuiChip-deleteIcon": {
                          color: "#fff",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "#fff",
                            transform: "scale(1.2) rotate(90deg)",
                            opacity: 0.8,
                          },
                          "&:active": {
                            transform: "scale(0.9) rotate(90deg)",
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            >
              {Object.values(AnimalSpecies).map((s) => {
                const isSelected = selectedSpecies.includes(s);
                return (
                  <MenuItem
                    key={s}
                    value={s}
                    sx={{
                      py: 1.5,
                      px: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transition: "all 0.2s ease",
                      borderLeft: "3px solid transparent",
                      "&:hover": {
                        backgroundColor: "rgba(1, 111, 53, 0.08)",
                        transform: "translateX(4px)",
                        borderLeftColor: "farmOrange.main",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(1, 111, 53, 0.12)",
                        borderLeftColor: "farmGreen.main",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "rgba(1, 111, 53, 0.16)",
                          transform: "translateX(4px)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      {SPECIES_EMOJIS[s]}
                    </Box>
                    <Box sx={{ flex: 1, fontWeight: isSelected ? 600 : 400 }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Box>
                    {isSelected && (
                      <CheckIcon
                        sx={{
                          color: "farmGreen.main",
                          fontSize: "1.2rem",
                          animation: "checkPop 0.3s ease",
                          "@keyframes checkPop": {
                            "0%": {
                              transform: "scale(0)",
                            },
                            "50%": {
                              transform: "scale(1.2)",
                            },
                            "100%": {
                              transform: "scale(1)",
                            },
                          },
                        }}
                      />
                    )}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Chip
            icon={<BookmarkBorderIcon />}
            label="Quick Start Templates"
            onClick={(e) => setPresetMenuAnchor(e.currentTarget)}
            sx={{
              px: 1,
              py: 3.3,
              borderRadius: 2,
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: "#fff",
              border: "1.5px solid #e0e0e0",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "farmOrange.main",
                backgroundColor: "rgba(255, 124, 1, 0.05)",
                transform: "translateY(-1px)",
              },
              "& .MuiChip-icon": {
                color: "farmGreen.main",
              },
            }}
          />
          <Menu
            anchorEl={presetMenuAnchor}
            open={Boolean(presetMenuAnchor)}
            onClose={() => setPresetMenuAnchor(null)}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
                minWidth: 250,
                mt: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setPresetMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                px: 2,
                fontStyle: "italic",
                color: "text.secondary",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
                borderLeft: "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(1, 111, 53, 0.08)",
                  transform: "translateX(4px)",
                  borderLeftColor: "farmOrange.main",
                },
              }}
            >
              None - Start from scratch
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              disabled
              sx={{
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "farmGreen.main",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                opacity: 1,
              }}
            >
              Default Templates
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePresetChange({
                  target: { value: "beefFocused" },
                } as SelectChangeEvent<string>);
                setPresetMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                borderLeft: "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(1, 111, 53, 0.08)",
                  transform: "translateX(4px)",
                  borderLeftColor: "farmGreen.main",
                },
              }}
            >
              <ListItemIcon>
                <BookmarkBorderIcon
                  fontSize="small"
                  sx={{ color: "farmGreen.main" }}
                />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: "14px", fontWeight: 500 },
                  },
                }}
              >
                Beef-Focused Processor
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePresetChange({
                  target: { value: "mixedOperation" },
                } as SelectChangeEvent<string>);
                setPresetMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                borderLeft: "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(1, 111, 53, 0.08)",
                  transform: "translateX(4px)",
                  borderLeftColor: "farmGreen.main",
                },
              }}
            >
              <ListItemIcon>
                <BookmarkBorderIcon
                  fontSize="small"
                  sx={{ color: "farmGreen.main" }}
                />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: "14px", fontWeight: 500 },
                  },
                }}
              >
                Mixed Operation
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePresetChange({
                  target: { value: "smallFarm" },
                } as SelectChangeEvent<string>);
                setPresetMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                borderLeft: "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(1, 111, 53, 0.08)",
                  transform: "translateX(4px)",
                  borderLeftColor: "farmGreen.main",
                },
              }}
            >
              <ListItemIcon>
                <BookmarkBorderIcon
                  fontSize="small"
                  sx={{ color: "farmGreen.main" }}
                />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: "14px", fontWeight: 500 },
                  },
                }}
              >
                Small Farm Processor
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePresetChange({
                  target: { value: "largeCommercial" },
                } as SelectChangeEvent<string>);
                setPresetMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                borderLeft: "3px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(1, 111, 53, 0.08)",
                  transform: "translateX(4px)",
                  borderLeftColor: "farmGreen.main",
                },
              }}
            >
              <ListItemIcon>
                <BookmarkBorderIcon
                  fontSize="small"
                  sx={{ color: "farmGreen.main" }}
                />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: "14px", fontWeight: 500 },
                  },
                }}
              >
                Large Commercial
              </ListItemText>
            </MenuItem>

            {customPresets.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  disabled
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    color: "farmOrange.main",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    opacity: 1,
                  }}
                >
                  Your Templates
                </MenuItem>
                {customPresets.map((preset) => (
                  <MenuItem
                    key={preset.name}
                    onClick={() => {
                      handlePresetChange({
                        target: { value: `custom-${preset.name}` },
                      } as SelectChangeEvent<string>);
                      setPresetMenuAnchor(null);
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      transition: "all 0.2s ease",
                      borderLeft: "3px solid transparent",
                      "&:hover": {
                        backgroundColor: "rgba(1, 111, 53, 0.08)",
                        transform: "translateX(4px)",
                        borderLeftColor: "farmOrange.main",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <BookmarkBorderIcon
                        fontSize="small"
                        sx={{ color: "farmOrange.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      slotProps={{
                        primary: {
                          sx: { fontSize: "14px", fontWeight: 500 },
                        },
                      }}
                    >
                      {preset.name}
                    </ListItemText>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomPreset(preset.name);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </MenuItem>
                ))}
              </>
            )}
          </Menu>
        </Box>

        {selectedSpecies.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, fontFamily: "roca", mb: 3 }}
            >
              Annual Processing Volume by Species
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {selectedSpecies.map((species, index) => (
                <Card
                  key={species}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "none",
                    border: "2px solid #e0e0e0",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                    animation: "fadeSlideIn 0.4s ease-out forwards",
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    "@keyframes fadeSlideIn": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(20px)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "farmOrange.main",
                        fontFamily: "roca",
                        mb: "15px",
                      }}
                    >
                      {species.charAt(0).toUpperCase() + species.slice(1)}
                      <Typography
                        component="span"
                        color="text.secondary"
                        sx={{
                          ml: 1,
                          fontWeight: 500,
                          fontFamily: "Poppins",
                          fontSize: "10px",
                        }}
                      >
                        (Avg: {AVG_HANGING_WEIGHTS[species]} lbs/animal)
                      </Typography>
                    </Typography>

                    <TextField
                      fullWidth
                      label="Total Annual Hanging Weight (lbs)"
                      type="number"
                      value={volumes[species] || ""}
                      onChange={(e) =>
                        handleVolumeChange(species, e.target.value)
                      }
                      slotProps={{
                        htmlInput: { min: 0, max: 10000000 },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">lbs</InputAdornment>
                          ),
                        },
                      }}
                      error={isAnnualHangingInvalid(species)}
                      helperText={
                        isAnnualHangingInvalid(species)
                          ? "Enter a value between 0 and 10,000,000"
                          : " "
                      }
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontSize: "0.875rem",
                        },
                        "& .MuiOutlinedInput-notchedOutline legend": {
                          width: "auto",
                          maxWidth: "w-fit",
                        },
                        "& input::placeholder": {
                          fontSize: "15px",
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "farmGreen.main",
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 600, fontFamily: "roca" }}
          >
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

        <Collapse in={showAdvanced}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Time Savings per Animal (minutes)"
              type="number"
              value={timePerAnimal}
              onChange={(e) => setTimePerAnimal(e.target.value)}
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">mins</InputAdornment>
                  ),
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "farmOrange.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "farmGreen.main",
                    borderWidth: 2,
                  },
                },
              }}
              error={isTimePerAnimalValid}
              helperText={
                isTimePerAnimalValid
                  ? "Enter a value between 1 minute and 480 minutes"
                  : " "
              }
            />
            <TextField
              fullWidth
              label="Average Hourly Wage ($)"
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              slotProps={{
                htmlInput: { min: 0 },
                input: {
                  endAdornment: (
                    <InputAdornment position="start">&nbsp;$</InputAdornment>
                  ),
                },
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "farmOrange.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "farmGreen.main",
                    borderWidth: 2,
                  },
                },
              }}
              error={isHourlyWageValid}
              helperText={
                isHourlyWageValid ? "Enter a value between $7.25 and $200" : " "
              }
            />
          </Box>
        </Collapse>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: "none",
          border: "2px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            mb: 3,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontFamily: "roca",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Summary
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <CustomButton
              variant="green"
              onClick={() => setViewMode("annual")}
              active={viewMode === "annual"}
            >
              Annual
            </CustomButton>
            <CustomButton
              variant="orange"
              onClick={() => setViewMode("monthly")}
              active={viewMode === "monthly"}
            >
              Monthly
            </CustomButton>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              pb: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Total {viewMode === "annual" ? "Annual" : "Monthly"} Volume
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            >
              {getDisplayVolume().toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              lbs
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              pb: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              color="success.main"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Total {viewMode === "annual" ? "Annual" : "Monthly"} Savings
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              color="success.main"
            >
              $
              {getDisplaySavings().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              color="error.main"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Total {viewMode === "annual" ? "Annual" : "Monthly"} Cost
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              color="error.main"
            >
              $
              {getDisplayCost().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 2,
              borderTop: 2,
              borderColor: "#e0e0e0",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "16px", sm: "18px" } }}
            >
              Net {viewMode === "annual" ? "Annual" : "Monthly"} Benefit:
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              $
              {getDisplayBenefit().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "roca" }}>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "14px", fontWeight: 500 }}>
            Are you sure you want to clear all selected species and volume data?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setClearDialogOpen(false)}
            sx={{
              color: "farmGreen.main",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmClearAll}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={savePresetDialogOpen}
        onClose={() => setSavePresetDialogOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "roca" }}>
          Save Custom Preset
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: "14px", fontWeight: 500 }}>
            Save your current calculator settings as a custom preset for quick
            access later.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g., My Farm Mix"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSavePreset();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#fafafa",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "farmOrange.main",
                  borderWidth: 2,
                },
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "farmGreen.main",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: 500,
                "&.Mui-focused": {
                  color: "farmGreen.main",
                  fontWeight: 600,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSavePresetDialogOpen(false);
              setPresetName("");
            }}
            sx={{
              color: "farmGreen.main",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <CustomButton variant="orange" onClick={handleSavePreset}>
            Save Preset
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
