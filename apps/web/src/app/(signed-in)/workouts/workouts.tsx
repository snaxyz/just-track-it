"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutSessionAndRedirect } from "@/server/workouts";
import { QueryResponse, WorkoutModel } from "@local/database";
import { useQuery } from "@tanstack/react-query";
import { ActivityIcon } from "lucide-react";
import {
  EmptyWorkoutsPlaceholder,
  WorkoutCard,
  WorkoutCardExercises,
} from "@/components/workouts";
import { IconButton } from "@/components/icon-button";
import { Title } from "@/components/title";
import { useCallback } from "react";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";

export function Workouts() {
  const { data: workoutsQuery, isLoading } = useQuery<
    QueryResponse<WorkoutModel>
  >({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutSessionAndRedirect(workoutId);
  }, []);

  if (isLoading) return <div>...loading...</div>;

  const noWorkouts = !workoutsQuery || workoutsQuery.records.length === 0;

  return (
    <>
      <Title>Workouts</Title>
      {noWorkouts && (
        <EmptyWorkoutsPlaceholder
          onAddClick={() => createWorkoutSessionAndRedirect()}
        />
      )}
      <div className="pb-24">
        {workoutsQuery?.records.map((w) => (
          <WorkoutCard
            key={w.id}
            id={w.id}
            name={w.name}
            onStartWorkout={handleStartWorkout}
          >
            <WorkoutCardExercises exercises={w.exercises} />
          </WorkoutCard>
        ))}
      </div>
      <FabContainer>
        <IconButton
          color="primary"
          variant="solid"
          onClick={() => createWorkoutSessionAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer>
    </>
  );
}
