import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  ActivityIcon,
  HistoryIcon,
  DumbbellIcon,
  TimerIcon,
  TrendingUpIcon,
  FlameIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";
import { DateTime } from "../date-time";

export interface PersonalBest {
  type: "volume" | "weight" | "reps";
  exercise: string;
  value: number;
}

export interface RecentWorkoutCardProps {
  workoutId: string;
  name: string;
  completedAt: string;
  onStartWorkout: (id: string) => void;
  stats?: {
    exerciseCount?: number;
    totalVolume?: number;
    duration?: number;
    personalBest?: PersonalBest;
    intensity?: number; // 0-100
    caloriesBurned?: number;
  };
}

export function RecentWorkoutCard({ workoutId, name, completedAt, onStartWorkout, stats }: RecentWorkoutCardProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        title={name}
        subheader={
          stats?.personalBest && (
            <Chip
              size="small"
              variant="outlined"
              icon={<TrophyIcon size={14} />}
              label={`${stats.personalBest.value}${stats.personalBest.type === "weight" ? "kg" : ""} ${stats.personalBest.exercise}`}
              sx={{ mt: 1 }}
            />
          )
        }
        action={
          <Link href={`/workouts/${workoutId}/history`}>
            <IconButton>
              <HistoryIcon size={16} />
            </IconButton>
          </Link>
        }
        sx={{
          "& .MuiCardHeader-title": {
            typography: "subtitle1",
            fontWeight: 500,
          },
        }}
      />
      <CardContent>
        <Stack spacing={2}>
          {stats && (
            <Box sx={{ display: "flex", gap: 3 }}>
              {stats.exerciseCount && (
                <Tooltip title="Exercises">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                    <DumbbellIcon size={16} />
                    <Box component="span" sx={{ typography: "body2" }}>
                      {stats.exerciseCount} exercises
                    </Box>
                  </Box>
                </Tooltip>
              )}

              {stats.totalVolume && (
                <Tooltip title="Total Volume">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                    <TrendingUpIcon size={16} />
                    <Box component="span" sx={{ typography: "body2" }}>
                      {stats.totalVolume}kg
                    </Box>
                  </Box>
                </Tooltip>
              )}
              {stats.duration && (
                <Tooltip title="Duration">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                    <TimerIcon size={16} />
                    <Box component="span" sx={{ typography: "body2" }}>
                      {stats?.duration}min
                    </Box>
                  </Box>
                </Tooltip>
              )}
            </Box>
          )}

          <Box
            sx={{
              typography: "caption",
              color: "text.secondary",
            }}
          >
            Completed on <DateTime iso={completedAt ?? ""} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<ActivityIcon size={16} />}
            color="primary"
            onClick={() => onStartWorkout(workoutId)}
          >
            Start workout
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
