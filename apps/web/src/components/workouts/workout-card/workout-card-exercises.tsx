import { WorkoutExerciseWithRelations } from "@local/db";
import { Box, Typography, List, ListItem, ListItemText, Chip, Stack } from "@mui/material";
import { DumbbellIcon } from "lucide-react";

interface Props {
  exercises: WorkoutExerciseWithRelations[];
}

export function WorkoutCardExercises({ exercises }: Props) {
  if (exercises.length === 0) {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary">
          No exercises
        </Typography>
      </Box>
    );
  }

  // Get unique categories across all exercises
  const categories = [...new Set(exercises.flatMap((e) => e.exercise.categories))];

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          Exercises
        </Typography>
        <List dense disablePadding>
          {exercises.map((e) => (
            <ListItem
              key={e.exerciseId}
              disableGutters
              sx={{
                py: 0.5,
                color: "text.secondary",
                typography: "body2",
              }}
            >
              <DumbbellIcon size={14} style={{ marginRight: 8 }} />
              <ListItemText
                primary={e.exercise.name}
                sx={{
                  m: 0,
                  "& .MuiListItemText-primary": {
                    typography: "body2",
                    textTransform: "capitalize",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {categories.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Target Areas
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  );
}
