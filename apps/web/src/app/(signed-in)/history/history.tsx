"use client";

import { Box, Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { QueryResponse, WorkoutSessionWithRelations, WorkoutSessionExerciseWithRelations } from "@local/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import { EmptySessionsPlaceholder } from "@/components/sessions";
import { PersonalBest, RecentWorkoutCard } from "@/components/workouts/recent-workout-card";
import { getWorkoutSessionHistory } from "@/app/api/workout-sessions/get-workout-sessions";
import { WorkoutHistoryCard } from "@/components/workouts/workout-history-card";

function calculateWorkoutStats(exercises: WorkoutSessionExerciseWithRelations[]) {
  if (!exercises?.length) return undefined;

  const exerciseCount = exercises.length;
  let totalVolume = 0;
  let totalDuration = 0;

  exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      // Calculate volume (weight * reps)
      if (set.weight && set.reps) {
        const weight = set.unit === "lbs" ? set.weight * 0.453592 : set.weight; // Convert to kg if needed
        totalVolume += weight * set.reps;
      }

      // Sum up duration
      if (set.duration) {
        totalDuration += set.duration;
      }
    });
  });

  // Estimate intensity based on volume and duration
  const intensity = Math.min(
    Math.round((totalVolume / (exerciseCount * 30)) * (totalDuration / (exerciseCount * 180)) * 100),
    100,
  );

  // Rough estimate of calories (very simplified)
  const caloriesBurned = Math.round((totalDuration / 60) * 7); // ~7 calories per minute

  // Find personal best (simplified example)
  const personalBest = exercises.reduce(
    (best, ex) => {
      const maxWeight = Math.max(...ex.sets.map((s) => s.weight || 0));
      if (maxWeight > (best?.value || 0)) {
        return {
          type: "weight" as const,
          exercise: ex.exercise.name,
          value: maxWeight,
        };
      }
      return best;
    },
    undefined as PersonalBest | undefined,
  );

  return {
    exerciseCount,
    ...(totalVolume > 0 && { totalVolume: Math.round(totalVolume) }),
    ...(totalDuration > 0 && { duration: Math.round(totalDuration / 60) }),
    intensity,
    caloriesBurned,
    ...(personalBest && { personalBest }),
  };
}

export function History() {
  const {
    data: workoutSessionsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSessions,
  } = useInfiniteQuery<QueryResponse<WorkoutSessionWithRelations>>({
    queryKey: ["workout-sessions"],
    queryFn: getWorkoutSessionHistory,
    initialPageParam: undefined,
    getNextPageParam: (lastRes) => lastRes.cursor,
  });

  const handleStartTraining = () => {
    createWorkoutAndSessionAndRedirect();
  };
  const handleStartWorkout = (workoutId: string) => {
    startWorkoutSessionAndRedirect(workoutId);
  };

  const showLoadingSessions = isFetchingNextPage || isLoadingSessions;

  return (
    <Box sx={{ pb: 3 }}>
      <Box component="section" sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          History
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {workoutSessionsQuery?.pages[0]?.records.length === 0 && (
            <EmptySessionsPlaceholder onAddClick={handleStartTraining} />
          )}
          {workoutSessionsQuery?.pages.map((p) =>
            p.records.map((w) => (
              <WorkoutHistoryCard
                key={w.id}
                workoutId={w.workoutId!}
                name={w.workout.name}
                completedAt={w.completedAt!}
                onStartWorkout={handleStartWorkout}
                stats={calculateWorkoutStats(w.exercises)}
              />
            )),
          )}
          {showLoadingSessions && (
            <Card variant="outlined" sx={{ mb: 3, zIndex: 0 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" height={48} />
              </CardContent>
            </Card>
          )}
        </Box>
        {hasNextPage && (
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              View more
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
