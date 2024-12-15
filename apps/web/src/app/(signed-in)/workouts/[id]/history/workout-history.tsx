"use client";

import { getWorkoutHistory } from "@/app/api/workouts/[id]/history/get-workout-session-by-workout";
import { Title } from "@/components/title";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  WorkoutSessionHistoryCard,
  WorkoutSessionHistoryCardExercise,
} from "@/components/sessions";
import { QueryResponse, WorkoutSessionWithRelations } from "@local/db";
import { Button, Card } from "@nextui-org/react";
import { DumbbellIcon } from "lucide-react";
import Link from "next/link";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { WorkoutHistoryLoading } from "./workout-history-loading";

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

  const hasHistory =
    historyQuery?.records.length && historyQuery.records.length > 0;

  return (
    <div className="pb-24">
      <div className="px-3">
        <Title>{historyQuery?.workoutName}</Title>
      </div>

      {!hasHistory ? (
        <Card className="m-3 p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <DumbbellIcon className="w-12 h-12 text-default-400" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium">No workout history</h3>
              <p className="text-default-500">
                You haven&apos;t completed any sessions for this workout yet.
              </p>
            </div>
            <Button color="primary" variant="flat" onPress={startWorkout}>
              Start Workout
            </Button>
          </div>
        </Card>
      ) : (
        historyQuery?.records.map((h) => (
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
        ))
      )}
    </div>
  );
}
