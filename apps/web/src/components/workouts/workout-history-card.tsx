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
import { WeightDisplay } from "@/components/common/weight-display";

export interface PersonalBest {
  type: "volume" | "weight" | "reps";
  exercise: string;
  value: number;
}

export interface WorkoutHistoryCardProps {
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

export function WorkoutHistoryCard({ workoutId, name, completedAt, onStartWorkout, stats }: WorkoutHistoryCardProps) {
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
              label={
                stats.personalBest.type === "weight" ? (
                  <>
                    <WeightDisplay weight={stats.personalBest.value} /> {stats.personalBest.exercise}
                  </>
                ) : (
                  `${stats.personalBest.value} ${stats.personalBest.exercise}`
                )
              }
              sx={{ mt: 1 }}
            />
          )
        }
        action={
          <Link href={`/history/${workoutId}`}>
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
                      <WeightDisplay weight={stats.totalVolume} />
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
