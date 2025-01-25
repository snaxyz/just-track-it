import { Box, Button, Card, CardContent, Divider, IconButton, SxProps, Theme } from "@mui/material";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EditWorkoutSessionExerciseModal } from "./edit-workout-session-exercise-modal";
import { WorkoutSessionExerciseModel, WorkoutSet, ExerciseModel, WeightUnit } from "@local/db";
import { AnimatedCard } from "./animated-card";

interface Props {
  sx?: SxProps<Theme>;
  exerciseName: string;
  exerciseId: string;
  exercise: ExerciseModel;
  children: React.ReactNode;
  showUpdateAnimation?: boolean;
  onAnimationComplete: () => void;
  sets: WorkoutSessionExerciseModel["sets"];
  onDelete: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, set: number, updates: Partial<WorkoutSet>) => void;
  onDeleteSet: (exerciseId: string, set: number) => void;
  unit: WeightUnit;
}

export function WorkoutSessionExerciseCard({
  sx,
  exerciseId,
  exerciseName,
  exercise,
  sets,
  children,
  showUpdateAnimation,
  onAnimationComplete,
  onDelete,
  onUpdateSet,
  onDeleteSet,
  unit,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showUpdateAnimation) {
      timeout = setTimeout(onAnimationComplete, 2000);
    }
    return () => timeout && clearTimeout(timeout);
  }, [showUpdateAnimation, onAnimationComplete]);

  const handleDeleteExercise = () => {
    onDelete(exerciseId);
    setIsOpen(false);
  };

  const handleUpdateSet = (set: number, updates: Partial<WorkoutSet>) => {
    onUpdateSet(exerciseId, set, updates);
  };

  const handleDeleteSet = (set: number) => {
    onDeleteSet(exerciseId, set);
    if (sets.length === 1) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatedCard variant="outlined" showAnimation={showUpdateAnimation} sx={sx}>
        <CardContent
          sx={{
            p: 0,
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1 }}>
            <Box
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                mr: 2,
                textTransform: "capitalize",
              }}
              title={exerciseName}
            >
              {exerciseName}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {sets.length > 0 && (
              <IconButton onClick={() => setIsOpen(true)} sx={{ minWidth: 0, p: 1 }}>
                <EditIcon size={16} />
              </IconButton>
            )}
          </Box>
          {sets.length > 0 && <Divider />}
          {children}
        </CardContent>
      </AnimatedCard>
      <EditWorkoutSessionExerciseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={exerciseId}
        name={exerciseName}
        exercise={exercise}
        sets={sets}
        onDeleteExercise={handleDeleteExercise}
        onUpdateSet={handleUpdateSet}
        onDeleteSet={handleDeleteSet}
        unit={unit}
      />
    </>
  );
}
