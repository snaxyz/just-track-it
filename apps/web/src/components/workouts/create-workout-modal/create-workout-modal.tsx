import { ExerciseAutocomplete, ExerciseSelect } from "@/components/exercises";
import { ExerciseModel } from "@local/db";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { KeyboardEventHandler, useCallback, useState } from "react";

interface SelectedExercise extends Pick<ExerciseModel, "id" | "name"> {
  isDraft?: boolean;
}

export interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: SelectedExercise[];
  onCreate: (input: { name: string; description: string; selectedExercises: SelectedExercise[] }) => void;
}

export function CreateWorkoutModal({ isOpen, onClose, exercises, onCreate }: CreateWorkoutModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [newExercise, setNewExercise] = useState("");
  const [draftExercises, setDraftExercises] = useState<SelectedExercise[]>([]);

  const handleCreateDraftExercise = useCallback((name: string) => {
    const exercise = {
      id: name.replace(/\s/g, "").toLowerCase(),
      name,
      categories: [],
      isDraft: true,
    };
    setDraftExercises((prev) => [...prev, exercise]);
    setSelectedExercises((prev) => [...prev, exercise.id]);
  }, []);

  const selectableExercises = exercises.concat(...draftExercises);

  const handleCreate = () => {
    onCreate({
      name,
      description,
      selectedExercises: selectableExercises.filter((e) => selectedExercises.includes(e.id)),
    });

    onClose?.();
    setName("");
    setDescription("");
    setSelectedExercises([]);
    setDraftExercises([]);
    setNewExercise("");
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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 3, px: 3 }}>Create Workout</DialogTitle>
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
          <TextField
            label="New exercise"
            placeholder="Add a new exercise"
            onKeyDown={handleNewExerciseKeyDown}
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCreate}
          disabled={!isValid}
          startIcon={<PlusIcon size={16} />}
          variant="outlined"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
