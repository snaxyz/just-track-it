import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ExerciseTargetAreasSelect } from "./exercise-target-areas-select";
import { ExerciseTrackingSelect, TrackingOption } from "./exercise-tracking-select";

export interface NewExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, targetAreas: string[], tracking: TrackingOption[], description?: string) => void;
  error?: string;
}

export function NewExerciseModal({ isOpen, onClose, onAdd, error }: NewExerciseModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAreas, setTargetAreas] = useState<string[]>([]);
  const [tracking, setTracking] = useState<TrackingOption[]>(["sets", "reps"]); // Default tracking options

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setTargetAreas([]);
      setTracking(["sets", "reps"]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 3, px: 3 }}>New Exercise</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Exercise"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            placeholder="Add notes about form, equipment, or other details"
          />
          <ExerciseTargetAreasSelect selectedTargetAreas={targetAreas} onTargetAreasChange={setTargetAreas} fullWidth />
          <ExerciseTrackingSelect selectedOptions={tracking} onOptionsChange={setTracking} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PlusIcon size={16} />}
          disabled={!name}
          onClick={() => onAdd(name, targetAreas, tracking, description || undefined)}
        >
          Add exercise
        </Button>
      </DialogActions>
    </Dialog>
  );
}
