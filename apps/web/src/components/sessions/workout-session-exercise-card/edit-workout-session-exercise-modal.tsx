import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { ExerciseModel, WeightUnit, WorkoutSet } from "@local/db";
import { RepSelect, WeightInput, DurationInput } from "../../common";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

interface EditWorkoutExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  exercise: ExerciseModel;
  sets: WorkoutSet[];
  onDeleteExercise: () => void;
  onUpdateSet: (set: number, updates: Partial<WorkoutSet>) => void;
  onDeleteSet: (set: number) => void;
  unit: WeightUnit;
}

export function EditWorkoutSessionExerciseModal({
  id,
  name,
  exercise,
  sets,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  isOpen,
  onClose,
  unit,
}: EditWorkoutExerciseModalProps) {
  const [expandedSets, setExpandedSets] = useState<number[]>([]);

  const handleToggleSet = (setIndex: number) => {
    setExpandedSets((prev) => (prev.includes(setIndex) ? prev.filter((i) => i !== setIndex) : [...prev, setIndex]));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pt: 3, px: 3 }}>{name}</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sets.map((set, ind) => {
            const isExpanded = expandedSets.includes(ind);
            return (
              <Card key={ind} variant="outlined" sx={{ background: "inherit" }}>
                <CardHeader
                  sx={{ py: 1, cursor: "pointer" }}
                  onClick={() => handleToggleSet(ind)}
                  title={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ typography: "caption", color: "text.secondary" }}>Set {ind + 1}</Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSet(ind);
                          }}
                          size="small"
                        >
                          <TrashIcon size={16} />
                        </IconButton>
                        {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                      </Box>
                    </Box>
                  }
                />
                <Collapse in={isExpanded}>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {exercise.trackReps && (
                        <RepSelect
                          reps={set.reps?.toString() ?? ""}
                          onChange={(reps) => onUpdateSet(ind, { reps: parseInt(reps) })}
                        />
                      )}
                      {exercise.trackWeight && set.unit && (
                        <WeightInput
                          weight={set.weight?.toString() ?? ""}
                          unit={set.unit}
                          onChange={(weight) => onUpdateSet(ind, { weight: parseFloat(weight) })}
                        />
                      )}
                      {exercise.trackDuration && (
                        <DurationInput
                          duration={set.duration?.toString() ?? "0"}
                          onChange={(duration) => onUpdateSet(ind, { duration: parseInt(duration) })}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          color="inherit"
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
