import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

interface SavePresetDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}

export const SavePresetDialog = ({
  open,
  onCancel,
  onConfirm,
}: SavePresetDialogProps) => {
  const [presetName, setPresetName] = useState("");

  const trimmedName = presetName.trim();

  const handleCancel = () => {
    setPresetName("");
    onCancel();
  };

  const handleConfirm = () => {
    if (!trimmedName) {
      return;
    }
    onConfirm(trimmedName);
    setPresetName("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <BookmarkAddOutlinedIcon color="primary" />
          <span>Save current selection as preset</span>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", pt: 0.5 }}>
        <DialogContentText sx={{ m: 0 }}>
          Enter a preset name. If the name already exists, it will update that
          preset.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          label="Preset Name"
          value={presetName}
          onChange={(event) => setPresetName(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!trimmedName}
        >
          Save Preset
        </Button>
      </DialogActions>
    </Dialog>
  );
};
