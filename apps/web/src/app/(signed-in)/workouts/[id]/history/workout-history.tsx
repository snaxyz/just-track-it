"use client";

import { getWorkoutSessionByWorkout } from "@/app/api/workouts/[id]/get-workout-session-by-workout";
import { Title } from "@/components/title";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  WorkoutSessionHistoryCard,
  WorkoutSessionHistoryCardExercise,
} from "@/components/sessions";
import { QueryResponse, WorkoutSessionWithRelations } from "@local/db";

export function WorkoutHistory() {
  const { id } = useParams<{ id: string }>();
  const { data: historyQuery, isLoading: isHistoryLoading } = useQuery<
    QueryResponse<WorkoutSessionWithRelations>
  >({
    queryKey: ["workout-history", id],
    queryFn: () => getWorkoutSessionByWorkout(id),
  });

  if (isHistoryLoading) return <div>...loading...</div>;

  return (
    <div className="pb-24">
      <div className="px-3">
        <Title>{historyQuery?.records[0].workout.name}</Title>
      </div>
      {historyQuery?.records.map((h) => (
        <WorkoutSessionHistoryCard key={h.id} date={h.createdAt}>
          {h.exercises.map((e) => (
            <WorkoutSessionHistoryCardExercise
              key={e.exerciseId}
              className="mb-2"
              exerciseName={e.exercise.name}
              {...e}
            />
          ))}
        </WorkoutSessionHistoryCard>
      ))}
    </div>
  );
}
