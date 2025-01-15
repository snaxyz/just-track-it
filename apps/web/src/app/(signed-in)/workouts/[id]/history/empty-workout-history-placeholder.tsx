import { Box, Button, Typography } from "@mui/material";
import { ActivityIcon } from "lucide-react";

interface Props {
  onStartWorkoutClick: () => void;
}

export function EmptyWorkoutHistoryPlaceholder({ onStartWorkoutClick }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 1,
        p: 6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          textAlign: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <ActivityIcon size={48} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No workout history
          </Typography>
          <Typography color="text.secondary">You haven't completed any sessions for this workout.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ActivityIcon size={16} />}
          color="primary"
          onClick={onStartWorkoutClick}
        >
          Start workout
        </Button>
      </Box>
    </Box>
  );
}
