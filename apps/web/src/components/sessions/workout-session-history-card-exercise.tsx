import { WorkoutSessionExerciseWithRelations } from "@local/db";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import { WeightDisplay } from "@/components/common/weight-display";
import { TrendingUpIcon, RepeatIcon, WeightIcon, TimerIcon } from "lucide-react";

interface Props {
  sx?: SxProps<Theme>;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSessionExerciseWithRelations["sets"];
  exercise: WorkoutSessionExerciseWithRelations["exercise"];
}

export function WorkoutSessionHistoryCardExercise({ sx, exerciseId, exerciseName, sets, exercise }: Props) {
  return (
    <Box key={exerciseId} sx={sx}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary", textTransform: "capitalize", mb: 1 }}>
        {exerciseName}
      </Typography>
      {sets.map((set, ind) => (
        <Box key={exerciseId + ind} sx={{ mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, sm: 3 },
              flexWrap: "wrap",
              py: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "80px" }}>
              <TrendingUpIcon size={14} />
              <Typography variant="body2">Set {ind + 1}</Typography>
            </Box>
            {exercise.trackReps && set.reps != null && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "80px" }}>
                <RepeatIcon size={14} />
                <Typography variant="body2">{set.reps} reps</Typography>
              </Box>
            )}
            {exercise.trackWeight && set.weight != null && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "80px" }}>
                <WeightIcon size={14} />
                <Typography variant="body2">
                  <WeightDisplay weight={set.weight} />
                </Typography>
              </Box>
            )}
            {exercise.trackDuration && set.duration != null && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "80px" }}>
                <TimerIcon size={14} />
                <Typography variant="body2">{set.duration}m</Typography>
              </Box>
            )}
          </Box>
        </Box>
      ))}
      {sets.length === 0 && (
        <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
          No sets recorded.
        </Typography>
      )}
    </Box>
  );
}
