import { ExerciseModel, WeightUnit } from "@local/db";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
  const handleAdd = () => {
    onAdd({
      selectedExercise,
      customExercise,
      set,
      reps,
      weight,
      unit,
    });
    onClose?.();
  };

  const isValid = (selectedExercise || customExercise) && set && reps && weight;
  const title = set === "1" ? "New Set" : `Set ${set}`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
      }}
    >
      <DialogTitle className="pt-3 px-3">{title}</DialogTitle>
      <DialogContent className="p-2">
        <Box className="space-y-4">
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
      <DialogActions className="p-2">
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
