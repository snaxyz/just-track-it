import { Box, Button } from "@mui/material";
import { WeightUnit } from "@local/db";

interface Props {
  exerciseId: string;
  set?: number | null;
  reps?: number | null;
  weight?: number | null;
  unit?: WeightUnit | null;
  onPress: (exerciseId: string) => void;
}

export function LastWorkoutExerciseSet({ exerciseId, set, reps, weight, unit, onPress }: Props) {
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
        <Box>{reps} reps</Box>
        {weight && (
          <Box>
            {weight} {unit}
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 2, color: "text.secondary", typography: "caption", fontStyle: "italic" }}>Add another set</Box>
    </Button>
  );
}
