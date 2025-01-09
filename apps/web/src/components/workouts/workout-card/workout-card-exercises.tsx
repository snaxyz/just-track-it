import { WorkoutExerciseWithRelations } from "@local/db";
import { Box, Chip, Typography } from "@mui/material";

interface Props {
  exercises: WorkoutExerciseWithRelations[];
}

export function WorkoutCardExercises({ exercises }: Props) {
  if (exercises.length === 0) {
    return (
      <Box>
        <Typography variant="caption" className="text-default-500 mb-2">
          No exercises
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="mb-4">
      <Typography variant="caption" className="text-default-500 mb-3">
        {exercises.length} Exercise{exercises.length > 1 ? "s" : ""}
      </Typography>
      <Box className="flex w-full gap-2 flex-wrap">
        {exercises.map((e) => (
          <Chip key={e.exerciseId} label={e.exercise.name} className="capitalize" variant="filled" size="small" />
        ))}
      </Box>
    </Box>
  );
}
