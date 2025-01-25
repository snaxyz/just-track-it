import { ExerciseModel, WeightUnit } from "@local/db";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { SetSelect, RepSelect, WeightInput, DurationInput } from "../../common";
import { PlusIcon, AlertCircleIcon } from "lucide-react";
import { ExerciseAutocomplete } from "@/components/exercises";
import { ExerciseTrackingSelect, TrackingOption } from "@/components/exercises/exercise-tracking-select";
import { useState, useEffect } from "react";

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
    duration: string;
    tracking?: TrackingOption[];
    targetAreas?: string[];
  }) => void;
  selectedExercise?: string;
  customExercise?: string;
  set: string;
  reps: string;
  weight: string;
  unit: WeightUnit;
  duration: string;
  onSelectedExerciseChange: (exerciseId: string) => void;
  onCustomExerciseChange: (exercise: string) => void;
  onSetChange: (set: string) => void;
  onRepsChange: (reps: string) => void;
  onWeightChange: (weight: string) => void;
  onDurationChange: (duration: string) => void;
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
  duration,
  onSelectedExerciseChange,
  onCustomExerciseChange,
  onSetChange,
  onRepsChange,
  onWeightChange,
  onDurationChange,
}: NewSetModalProps) {
  const [isCreatingNewExercise, setIsCreatingNewExercise] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<TrackingOption[]>(["sets", "reps"]);

  // Reset tracking options when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsCreatingNewExercise(false);
      setSelectedTracking(["sets", "reps"]);
    }
  }, [isOpen]);

  // Check if we're creating a new exercise whenever customExercise changes
  useEffect(() => {
    const isExistingExercise = exercises.some((e) => e.name.toLowerCase() === customExercise?.trim().toLowerCase());
    setIsCreatingNewExercise(Boolean(customExercise) && !isExistingExercise);
  }, [customExercise, exercises]);

  const title = selectedExercise || customExercise ? "Add set" : "Add exercise set";
  const isValid = Boolean(selectedExercise || customExercise);

  // Get tracking settings for selected exercise
  const exercise = selectedExercise ? exercises.find((e) => e.id === selectedExercise) : null;
  const showReps = isCreatingNewExercise ? selectedTracking.includes("reps") : !selectedExercise || exercise?.trackReps;
  const showWeight = isCreatingNewExercise
    ? selectedTracking.includes("weight")
    : !selectedExercise || exercise?.trackWeight;
  const showDuration = isCreatingNewExercise
    ? selectedTracking.includes("duration")
    : !selectedExercise || exercise?.trackDuration;

  const handleAdd = () => {
    onAdd({
      selectedExercise,
      customExercise,
      set,
      reps,
      weight,
      unit,
      duration,
      ...(isCreatingNewExercise && {
        tracking: selectedTracking,
        targetAreas: [],
      }),
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

          {/* New Exercise Indicator */}
          {isCreatingNewExercise && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                p: 1,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <AlertCircleIcon size={16} />
              <Typography variant="body2">Creating new exercise: &quot;{customExercise}&quot;</Typography>
            </Box>
          )}

          {/* Show tracking options when creating new exercise */}
          {isCreatingNewExercise && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                What would you like to track for this exercise?
              </Typography>
              <ExerciseTrackingSelect
                selectedOptions={selectedTracking}
                onOptionsChange={setSelectedTracking}
                fullWidth
              />
            </Box>
          )}

          {/* Show input fields based on tracking settings */}
          {showReps && <RepSelect reps={reps} onChange={onRepsChange} />}
          {showWeight && <WeightInput unit={unit} weight={weight} onChange={onWeightChange} />}
          {showDuration && <DurationInput duration={duration} onChange={onDurationChange} />}
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
