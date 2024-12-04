"use client";

import { getWorkoutHistory } from "@/app/api/workouts/[id]/get-workout-history";
import { EnhancedWorkoutHistory } from "@/app/api/workouts/[id]/route";
import { Title } from "@/components/title";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { History } from "./components/history";
import { HistoryExercise } from "./components/history-exercise";

export function WorkoutHistoryList() {
  const { id } = useParams<{ id: string }>();
  const { data: historyQuery, isLoading: isHistoryLoading } =
    useQuery<EnhancedWorkoutHistory>({
      queryKey: ["workout-history", id],
      queryFn: () => getWorkoutHistory(id),
    });

  if (isHistoryLoading) return <div>...loading...</div>;

  return (
    <div className="pb-24">
      <Title>{historyQuery?.workoutName}</Title>
      {historyQuery?.records.map((h) => (
        <History
          key={h.id}
          className="rounded-lg bg-zinc-200 dark:bg-zinc-800 p-2 mb-3"
          date={h.date}
        >
          {h.exercises.map((e) => (
            <HistoryExercise key={e.exerciseId} className="mb-2" {...e} />
          ))}
        </History>
      ))}
    </div>
  );
}
