"use client";

import { getWorkoutSessionByWorkout } from "@/app/api/workouts/[id]/get-workout-session-by-workout";
import { EnhancedWorkoutHistory } from "@/app/api/workouts/[id]/route";
import { Title } from "@/components/title";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  WorkoutSessionCard,
  WorkoutSessionCardExercise,
} from "@/components/sessions";

export function WorkoutHistory() {
  const { id } = useParams<{ id: string }>();
  const { data: historyQuery, isLoading: isHistoryLoading } =
    useQuery<EnhancedWorkoutHistory>({
      queryKey: ["workout-history", id],
      queryFn: () => getWorkoutSessionByWorkout(id),
    });

  if (isHistoryLoading) return <div>...loading...</div>;

  return (
    <div className="pb-24">
      <Title>{historyQuery?.workoutName}</Title>
      {historyQuery?.records.map((h) => (
        <WorkoutSessionCard
          key={h.id}
          className="rounded-lg bg-zinc-200 dark:bg-zinc-800 p-2 mb-3"
          date={h.date}
        >
          {h.exercises.map((e) => (
            <WorkoutSessionCardExercise
              key={e.exerciseId}
              className="mb-2"
              {...e}
            />
          ))}
        </WorkoutSessionCard>
      ))}
    </div>
  );
}
