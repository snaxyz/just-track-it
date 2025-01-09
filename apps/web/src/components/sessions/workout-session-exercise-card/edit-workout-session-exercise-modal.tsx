import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { WorkoutSessionExerciseWithRelations, WorkoutSet } from "@local/db";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { TrashIcon } from "lucide-react";

interface EditWorkoutExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  sets: WorkoutSet[];
  onDeleteExercise: () => void;
  onUpdateSet: (set: number, updates: Partial<WorkoutSet>) => void;
  onDeleteSet: (set: number) => void;
}

export function EditWorkoutSessionExerciseModal({
  id,
  name,
  sets,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  isOpen,
  onClose,
}: EditWorkoutExerciseModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
      }}
    >
      <DialogTitle className="capitalize pt-3 px-2">{name}</DialogTitle>
      <DialogContent className="py-2 px-0">
        {sets.map((set, ind) => (
          <Box key={ind} className="mb-2 px-2">
            <Box className="flex items-center text-caption-light dark:text-caption text-xs mb-2">
              <span>Set {ind + 1}</span>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => onDeleteSet(ind)} size="small" color="error">
                <TrashIcon size={16} />
              </IconButton>
            </Box>
            <Box className="flex items-center gap-2">
              <RepSelect
                reps={set.reps?.toString() ?? ""}
                onChange={(reps) => onUpdateSet(ind, { reps: parseInt(reps) })}
              />
              {set.weight && set.unit && (
                <WeightSelect
                  weight={set.weight?.toString()}
                  unit={set.unit}
                  onChange={(weight) => onUpdateSet(ind, { weight: parseFloat(weight) })}
                />
              )}
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions className="p-2">
        <Button
          color="error"
          onClick={onDeleteExercise}
          variant="outlined"
          size="small"
          startIcon={<TrashIcon size={16} />}
          sx={{ marginRight: "auto" }}
        >
          Remove exercise
        </Button>
      </DialogActions>
    </Dialog>
  );
}
