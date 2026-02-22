import { Button, Stack } from "@mui/material";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

interface CalculatorActionsBarProps {
  isClearAllDisabled: boolean;
  onOpenClearAll: () => void;
  onOpenSavePreset: () => void;
  onExportCsv: () => void;
  onPrintReport: () => void;
  isExportDisabled: boolean;
  isSavePresetDisabled: boolean;
}

export const CalculatorActionsBar = ({
  isClearAllDisabled,
  onOpenClearAll,
  onOpenSavePreset,
  onExportCsv,
  onPrintReport,
  isExportDisabled,
  isSavePresetDisabled,
}: CalculatorActionsBarProps) => {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2.5 }} flexWrap="wrap" useFlexGap>
      <Button
        variant="outlined"
        color="error"
        disabled={isClearAllDisabled}
        onClick={onOpenClearAll}
        startIcon={<DeleteSweepOutlinedIcon />}
      >
        Clear All
      </Button>
      <Button
        variant="outlined"
        onClick={onOpenSavePreset}
        disabled={isSavePresetDisabled}
        startIcon={<BookmarkAddOutlinedIcon />}
      >
        Save as Preset
      </Button>
      <Button
        variant="outlined"
        onClick={onExportCsv}
        disabled={isExportDisabled}
        startIcon={<DownloadOutlinedIcon />}
      >
        Export CSV
      </Button>
      <Button
        variant="outlined"
        onClick={onPrintReport}
        disabled={isExportDisabled}
        startIcon={<PrintOutlinedIcon />}
      >
        Print Report
      </Button>
    </Stack>
  );
};
