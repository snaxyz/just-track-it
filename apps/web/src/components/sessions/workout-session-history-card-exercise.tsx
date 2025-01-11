import { WorkoutSessionExerciseWithRelations } from "@local/db";
import { Box, SxProps, Theme } from "@mui/material";

interface Props {
  sx?: SxProps<Theme>;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSessionExerciseWithRelations["sets"];
}

export function WorkoutSessionHistoryCardExercise({ sx, exerciseId, exerciseName, sets }: Props) {
  return (
    <Box key={exerciseId} sx={sx}>
      <Box sx={{ color: "text.secondary", textTransform: "capitalize" }}>{exerciseName}</Box>
      {sets.map((set, ind) => (
        <Box key={exerciseId + ind}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <Box sx={{ flexBasis: "33.33%" }}>Set {ind + 1}</Box>
            <Box sx={{ flexBasis: "33.33%" }}>{set.reps} reps</Box>
            {set.weight && (
              <Box sx={{ flexBasis: "33.33%" }}>
                {set.weight} {set.unit}
              </Box>
            )}
          </Box>
        </Box>
      ))}
      {sets.length === 0 && (
        <Box sx={{ color: "text.secondary", typography: "caption", fontStyle: "italic" }}>No sets recorded.</Box>
      )}
    </Box>
  );
}
