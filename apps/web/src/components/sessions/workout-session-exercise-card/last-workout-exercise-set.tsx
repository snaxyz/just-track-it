import { Box, Button } from "@mui/material";
import { ExerciseModel, WeightUnit } from "@local/db";

interface Props {
  exerciseId: string;
  exercise: ExerciseModel;
  set?: number | null;
  reps?: number | null;
  weight?: number | null;
  unit?: WeightUnit | null;
  duration?: number | null;
  onClick: (exerciseId: string) => void;
}

export function LastWorkoutExerciseSet({
  exerciseId,
  exercise,
  set,
  reps,
  weight,
  unit,
  duration,
  onClick: onPress,
}: Props) {
  return (
    <Button
      onClick={() => onPress(exerciseId)}
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          textTransform: "capitalize",
          color: "text.primary",
        }}
      >
        <Box>Set {set}</Box>
        {exercise.trackReps && reps != null && <Box>{reps} reps</Box>}
        {exercise.trackWeight && weight != null && (
          <Box>
            {Math.round(weight)} {unit}
          </Box>
        )}
        {exercise.trackDuration && duration != null && <Box>{duration}m</Box>}
      </Box>
      <Box sx={{ mt: 2, color: "text.secondary", typography: "caption", fontStyle: "italic" }}>Add another set</Box>
    </Button>
  );
}
