import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

interface ClearAllDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ClearAllDialog = ({
  open,
  onCancel,
  onConfirm,
}: ClearAllDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <WarningAmberOutlinedIcon color="warning" />
          <span>Clear all calculator data?</span>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", pt: 0.5 }}>
        <DialogContentText sx={{ m: 0 }}>
          This clears species, volumes, advanced settings, scenario comparison,
          and saved browser data.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Clear All
        </Button>
      </DialogActions>
    </Dialog>
  );
};
