import { ExerciseSelect } from "@/components/exercises";
import { ExerciseModel, WorkoutWithRelations } from "@local/db";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { SaveIcon } from "lucide-react";
import { KeyboardEventHandler, useCallback, useEffect, useState } from "react";

interface SelectedExercise extends Pick<ExerciseModel, "id" | "name"> {
  isDraft?: boolean;
}

export interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout?: Pick<WorkoutWithRelations, "name" | "description" | "exercises">;
  exercises: SelectedExercise[];
  onSave: (input: { name: string; description: string; selectedExercises: SelectedExercise[] }) => void;
}

export function EditWorkoutModal({ isOpen, onClose, workout, exercises, onSave }: EditWorkoutModalProps) {
  const [name, setName] = useState(workout?.name ?? "");
  const [description, setDescription] = useState(workout?.description ?? "");
  const [selectedExercises, setSelectedExercises] = useState<string[]>(
    workout?.exercises?.map((e) => e.exerciseId) ?? [],
  );

  useEffect(() => {
    setName(workout?.name ?? "");
    setDescription(workout?.description ?? "");
    setSelectedExercises(workout?.exercises?.map((e) => e.exerciseId) ?? []);
  }, [workout?.name, workout?.description, workout?.exercises]);

  const [newExercise, setNewExercise] = useState("");
  const [draftExercises, setDraftExercises] = useState<SelectedExercise[]>([]);

  const handleCreateDraftExercise = useCallback((name: string) => {
    const exercise = {
      id: name.replace(/\s/g, "").toLowerCase(),
      name,
      isDraft: true,
    };
    setDraftExercises((prev) => [...prev, exercise]);
    setSelectedExercises((prev) => [...prev, exercise.id]);
  }, []);

  const selectableExercises = exercises.concat(...draftExercises);

  const handleSave = () => {
    onSave({
      name,
      description,
      selectedExercises: selectableExercises.filter((e) => selectedExercises.includes(e.id)),
    });

    onClose?.();
    setDraftExercises([]);
  };

  const handleNewExerciseKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const exerciseName = newExercise.trim();
    if (!exerciseName) return;
    if (e.key === "Enter") {
      const existingExercise = selectableExercises.find((e) => e.name.toLowerCase() === exerciseName.toLowerCase());
      if (!existingExercise) {
        setNewExercise("");
        return handleCreateDraftExercise(exerciseName);
      }
      const alreadySelected = selectedExercises.includes(existingExercise.id);
      if (!alreadySelected) {
        setSelectedExercises((prev) => [...prev, existingExercise.id]);
      }
      setNewExercise("");
    }
  };

  const isValid = name && selectedExercises.length > 0;

  return (
    <Dialog open={isOpen && Boolean(workout)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 3, px: 3 }}>Edit Workout</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            placeholder="Workout name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            placeholder="1 - 3 sets, 5-8 reps."
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={1}
          />
          {selectableExercises.length > 0 && (
            <ExerciseSelect
              exercises={selectableExercises}
              selectedExercises={selectedExercises}
              onExercisesChange={setSelectedExercises}
              fullWidth
            />
          )}
          {/* <TextField
            label="New exercise"
            placeholder="Add a new exercise"
            onKeyDown={handleNewExerciseKeyDown}
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
          /> */}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleSave}
          disabled={!isValid}
          startIcon={<SaveIcon size={16} />}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
