"use client";

import { Box, Button, Card, CardContent, Skeleton, Typography, Divider } from "@mui/material";
import { createWorkoutAndSessionAndRedirect, updateWorkout } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import {
  QueryResponse,
  WorkoutSessionWithRelations,
  WorkoutSessionExerciseWithRelations,
  WorkoutWithRelations,
  ExerciseModel,
} from "@local/db";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkoutSessions } from "../api/workout-sessions/get-workout-sessions";
import { EmptySessionsPlaceholder } from "@/components/sessions";
import { WorkoutCard } from "@/components/workouts/workout-card/workout-card";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { EditWorkoutModal, EditWorkoutModalProps } from "@/components/workouts/edit-workout-modal";
import { useState } from "react";
import { getExercises } from "../api/exercises/get-exercises";
import { WorkoutHistoryCard, PersonalBest } from "@/components/workouts/workout-history-card";
import { EmptyWorkoutsPlaceholder } from "@/components/workouts";
import { useRouter } from "next/navigation";
import { StartWorkoutModal } from "@/components/workouts/start-workout-modal";
import { ActivityIcon, TrendingUpIcon, SparklesIcon } from "lucide-react";

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

export function Dashboard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isStartWorkoutModalOpen, setIsStartWorkoutModalOpen] = useState(false);
  const {
    data: workoutSessionsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingSessions,
  } = useInfiniteQuery<QueryResponse<WorkoutSessionWithRelations>>({
    queryKey: ["workout-sessions"],
    queryFn: getWorkoutSessions,
    initialPageParam: undefined,
    getNextPageParam: (lastRes) => lastRes.cursor,
  });

  const { data: workoutsQuery, isLoading: isLoadingWorkouts } = useQuery<QueryResponse<WorkoutWithRelations>>({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

  const { data: exercisesQuery } = useQuery<QueryResponse<ExerciseModel>>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const handleStartWorkout = (workoutId: string) => {
    startWorkoutSessionAndRedirect(workoutId);
  };

  const handleStartTraining = () => {
    setIsStartWorkoutModalOpen(true);
  };

  const handleCloseStartWorkoutModal = () => {
    setIsStartWorkoutModalOpen(false);
  };

  const [selectedWorkout, setSelectedWorkout] =
    useState<Pick<WorkoutWithRelations, "id" | "name" | "description" | "exercises">>();

  const handleEditWorkout = (id: string) => {
    setSelectedWorkout(workoutsQuery?.records?.find((w) => w.id === id));
  };
  const onCloseEditWorkout = () => setSelectedWorkout(undefined);

  const handleSaveWorkout: EditWorkoutModalProps["onSave"] = async (input) => {
    const workoutId = selectedWorkout?.id ?? "";
    queryClient.setQueryData(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: workoutsQuery?.records.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              name: input.name,
              description: input.description,
              exercises: input.selectedExercises.map((e) => ({
                exerciseId: e.id,
                exercise: { name: e.name },
              })),
            }
          : w,
      ),
    });
    const workout = await updateWorkout(workoutId, input.name, input.description ?? "", input.selectedExercises);

    queryClient.setQueryData<QueryResponse<WorkoutWithRelations>>(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: workoutsQuery?.records.map((w) => (w.id === workoutId ? { ...w, ...workout } : w)) ?? [],
    });

    onCloseEditWorkout();
  };

  const hasRecentWorkouts = Boolean(workoutSessionsQuery?.pages[0]?.records.length);
  const showLoadingSessions = isFetchingNextPage || isLoadingSessions;

  return (
    <>
      <Box sx={{ pb: 3 }}>
        {/* Start Workout Section - Only show if there are recent workouts */}
        {hasRecentWorkouts && (
          <Box component="section" sx={{ mb: 6 }}>
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                  "& .hover-content": {
                    opacity: 1,
                  },
                },
              }}
              onClick={handleStartTraining}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <ActivityIcon size={24} />
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    Start New Workout
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Last workout
                    </Typography>
                    <Typography variant="body1">
                      {workoutSessionsQuery?.pages[0]?.records[0]?.workout.name ?? "Unknown"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Streak
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUpIcon size={16} />
                      <Typography variant="body1">3 days</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  className="hover-content"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "secondary.main",
                    opacity: 0.8,
                    transition: "opacity 0.2s",
                  }}
                >
                  <SparklesIcon size={16} />
                  <Typography variant="body2">Choose from blank, existing, or AI-generated workouts</Typography>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: (theme) =>
                      `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Recent Workouts Section */}
        <Box component="section" sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Workouts
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {!hasRecentWorkouts && <EmptySessionsPlaceholder onAddClick={handleStartTraining} />}
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

        {/* Existing Workouts Section */}
        <Box component="section">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Workouts
          </Typography>
          {workoutsQuery?.records.length === 0 && (
            <EmptyWorkoutsPlaceholder onAddClick={() => router.push("/workouts")} />
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {workoutsQuery?.records.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                name={workout.name}
                description={workout.description ?? ""}
                onStartWorkout={handleStartWorkout}
                onEditClick={handleEditWorkout}
              />
            ))}
            {isLoadingWorkouts && (
              <Card variant="outlined" sx={{ mb: 3, zIndex: 0 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" height={48} />
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
      <EditWorkoutModal
        isOpen={Boolean(selectedWorkout)}
        onClose={onCloseEditWorkout}
        workout={selectedWorkout}
        exercises={exercisesQuery?.records ?? []}
        onSave={handleSaveWorkout}
      />
      <StartWorkoutModal isOpen={isStartWorkoutModalOpen} onClose={handleCloseStartWorkoutModal} />
    </>
  );
}
