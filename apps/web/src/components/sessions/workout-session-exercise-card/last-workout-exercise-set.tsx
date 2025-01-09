import { Box, Button } from "@mui/material";
import { cn } from "@/lib/utils";
import { WeightUnit } from "@local/db";

interface Props {
  className?: string;
  set?: number | null;
  reps?: number | null;
  weight?: number | null;
  unit?: WeightUnit | null;
  exerciseId: string;
  onPress: (exerciseId: string) => void;
}

export function LastWorkoutExerciseSet({ className, set, reps, weight, unit, exerciseId, onPress }: Props) {
  return (
    <Button
      className={cn("min-w-0 block bg-transparent p-3", "text-left h-auto", className)}
      fullWidth
      onClick={() => onPress(exerciseId)}
    >
      <Box>Last set</Box>
      <Box className="flex items-center w-full justify-between mb-2">
        <Box>Set {set}</Box>
        <Box>{reps} reps</Box>
        {weight && (
          <Box>
            {weight} {unit}
          </Box>
        )}
      </Box>
      <Box className="text-caption-light dark:text-caption text-xs italic text-center">Add another set</Box>
    </Button>
  );
}
