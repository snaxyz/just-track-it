import { Box, Button, Card, CardContent, IconButton } from "@mui/material";
import { ActivityIcon, EditIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  description: string | null;
  children: React.ReactNode;
  onStartWorkout: (workoutId: string) => void;
  onEditClick: (id: string) => void;
}

export function WorkoutCard({ id, name, description, children, onStartWorkout, onEditClick }: Props) {
  return (
    <Card className="mb-3 z-0" variant="outlined">
      <CardContent>
        <Box className="flex items-center mb-2">
          <Box>{name}</Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton component={Link} href={`/workouts/${id}/history`}>
            <HistoryIcon size={16} />
          </IconButton>
          <IconButton onClick={() => onEditClick(id)}>
            <EditIcon size={16} />
          </IconButton>
        </Box>
        {description && <Box className="mb-4">{description}</Box>}
        {children}
        <Box>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ActivityIcon size={16} />}
            color="secondary"
            onClick={() => onStartWorkout(id)}
          >
            Start workout
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
