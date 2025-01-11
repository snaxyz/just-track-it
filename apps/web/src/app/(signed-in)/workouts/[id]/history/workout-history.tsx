"use client";

import { getWorkoutHistory } from "@/app/api/workouts/[id]/history/get-workout-session-by-workout";
import { Title } from "@/components/title";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { WorkoutSessionHistoryCard, WorkoutSessionHistoryCardExercise } from "@/components/sessions";
import { QueryResponse, WorkoutSessionWithRelations } from "@local/db";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { WorkoutHistoryLoading } from "./workout-history-loading";
import { EmptyWorkoutHistoryPlaceholder } from "./empty-workout-history-placeholder";
import { Box } from "@mui/material";

export function WorkoutHistory() {
  const { id } = useParams<{ id: string }>();
  const { data: historyQuery, isLoading: isHistoryLoading } = useQuery<
    QueryResponse<WorkoutSessionWithRelations> & { workoutName: string }
  >({
    queryKey: ["workout-history", id],
    queryFn: () => getWorkoutHistory(id),
  });

  const startWorkout = () => {
    startWorkoutSessionAndRedirect(id);
  };

  if (isHistoryLoading) return <WorkoutHistoryLoading />;

  const hasHistory = historyQuery?.records.length && historyQuery.records.length > 0;

  return (
    <Box sx={{ pb: 24 }}>
      {!hasHistory ? (
        <EmptyWorkoutHistoryPlaceholder onStartWorkoutClick={startWorkout} />
      ) : (
        historyQuery?.records.map((h) => (
          <WorkoutSessionHistoryCard key={h.id} date={h.createdAt}>
            {h.exercises.map((e) => (
              <WorkoutSessionHistoryCardExercise
                key={e.exerciseId}
                sx={{ mb: 2 }}
                exerciseName={e.exercise.name}
                {...e}
              />
            ))}
          </WorkoutSessionHistoryCard>
        ))
      )}
    </Box>
  );
}
