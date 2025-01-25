import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import { PlusIcon, TrashIcon } from "lucide-react";
import { ExerciseTargetAreasSelect } from "./exercise-target-areas-select";
import { useState } from "react";
import { ExerciseTrackingSelect, TrackingOption } from "./exercise-tracking-select";

export interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, targetAreas: string[], tracking: TrackingOption[], description?: string) => void;
  onDelete: () => void;
  name: string;
  description?: string | null;
  targetAreas: string[];
  tracking: TrackingOption[];
}

export function EditExerciseModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  name: initialName,
  description: initialDescription = "",
  targetAreas: initialTargetAreas,
  tracking: initialTracking,
}: EditExerciseModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [targetAreas, setTargetAreas] = useState<string[]>(initialTargetAreas);
  const [tracking, setTracking] = useState<TrackingOption[]>(initialTracking);

  const handleSave = () => {
    onSave(name, targetAreas, tracking, description || undefined);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 3, px: 3 }}>Edit Exercise</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField fullWidth label="Exercise" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            placeholder="Add notes about form, equipment, or other details"
          />
          <ExerciseTargetAreasSelect selectedTargetAreas={targetAreas} onTargetAreasChange={setTargetAreas} fullWidth />
          <ExerciseTrackingSelect selectedOptions={tracking} onOptionsChange={setTracking} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <IconButton onClick={onDelete}>
          <TrashIcon size={16} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon size={16} />}
          disabled={!name}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
