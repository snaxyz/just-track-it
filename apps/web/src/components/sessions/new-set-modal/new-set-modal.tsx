import { ExerciseModel, WeightUnit } from "@local/db";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { PlusIcon } from "lucide-react";
import { ExerciseAutocomplete } from "@/components/exercises";

export interface NewSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: ExerciseModel[];
  onAdd: (input: {
    selectedExercise?: string;
    customExercise?: string;
    set: string;
    reps: string;
    weight: string;
    unit: WeightUnit;
  }) => void;
  selectedExercise?: string;
  customExercise?: string;
  set: string;
  reps: string;
  weight: string;
  unit: WeightUnit;
  onSelectedExerciseChange: (exerciseId: string) => void;
  onCustomExerciseChange: (exercise: string) => void;
  onSetChange: (set: string) => void;
  onRepsChange: (reps: string) => void;
  onWeightChange: (weight: string) => void;
}

export function NewSetModal({
  isOpen,
  onClose,
  exercises,
  onAdd,
  selectedExercise,
  customExercise,
  set,
  reps,
  weight,
  unit,
  onSelectedExerciseChange,
  onCustomExerciseChange,
  onSetChange,
  onRepsChange,
  onWeightChange,
}: NewSetModalProps) {
  const title = selectedExercise || customExercise ? "Add set" : "Add exercise set";
  const isValid = Boolean(selectedExercise || customExercise);

  const handleAdd = () => {
    onAdd({
      selectedExercise,
      customExercise,
      set,
      reps,
      weight,
      unit,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary">
          Set {set}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <ExerciseAutocomplete
            exercises={exercises}
            selectedExercise={selectedExercise}
            customExercise={customExercise}
            onSelectedExerciseChange={onSelectedExerciseChange}
            onCustomExerciseChange={onCustomExerciseChange}
            placeholder="Select or type exercise"
          />
          <RepSelect reps={reps} onChange={onRepsChange} />
          <WeightSelect unit={unit} weight={weight} onChange={onWeightChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAdd}
          disabled={!isValid}
          startIcon={<PlusIcon size={16} />}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
