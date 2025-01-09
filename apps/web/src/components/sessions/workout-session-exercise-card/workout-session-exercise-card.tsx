import { Box, Button, Card, CardContent, Divider } from "@mui/material";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EditWorkoutSessionExerciseModal } from "./edit-workout-session-exercise-modal";
import { WorkoutSessionExerciseModel, WorkoutSet } from "@local/db";

interface Props {
  className?: string;
  exerciseName: string;
  exerciseId: string;
  children: React.ReactNode;
  showUpdateAnimation?: boolean;
  onAnimationComplete: () => void;
  sets: WorkoutSessionExerciseModel["sets"];
  onDelete: (exerciseId: string) => void;
  onUpdateSet: (exerciseId: string, set: number, updates: Partial<WorkoutSet>) => void;
  onDeleteSet: (exerciseId: string, set: number) => void;
}

export function WorkoutSessionExerciseCard({
  className,
  exerciseId,
  exerciseName,
  sets,
  children,
  showUpdateAnimation,
  onAnimationComplete,
  onDelete,
  onUpdateSet,
  onDeleteSet,
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
      <Card className={cn(showUpdateAnimation && "animate-gradient-outline", className)} elevation={0}>
        <CardContent>
          <Box className="flex items-center">
            <Box className="text-nowrap text-ellipsis overflow-hidden mr-2 capitalize" title={exerciseName}>
              {exerciseName}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {sets.length > 0 && (
              <Button variant="outlined" onClick={() => setIsOpen(true)} sx={{ minWidth: 0, p: 1 }}>
                <EditIcon size={16} />
              </Button>
            )}
          </Box>
          {sets.length > 0 && <Divider sx={{ my: 1 }} />}
          {children}
        </CardContent>
      </Card>
      <EditWorkoutSessionExerciseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={exerciseId}
        name={exerciseName}
        sets={sets}
        onDeleteExercise={handleDeleteExercise}
        onUpdateSet={handleUpdateSet}
        onDeleteSet={handleDeleteSet}
      />
    </>
  );
}
