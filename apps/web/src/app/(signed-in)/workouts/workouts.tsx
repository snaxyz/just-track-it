"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { QueryResponse, WorkoutModel } from "@local/database";
import { useQuery } from "@tanstack/react-query";
import { ActivityIcon } from "lucide-react";
import { EmptyWorkoutsPlaceholder } from "./components/empty-workouts-placeholder";
import { Workout } from "./components/workout";
import { WorkoutExercises } from "./components/workout/workout-exercises";
import { useCallback } from "react";
import { startWorkoutAndRedirect } from "@/server/workouts/start-workout";
import { IconButton } from "@/components/icon-button";
import { Title } from "@/components/title";

export function Workouts() {
  const { data: workoutsQuery, isLoading } = useQuery<
    QueryResponse<WorkoutModel>
  >({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutAndRedirect(workoutId);
  }, []);

  if (isLoading) return <div>...loading...</div>;

  const noWorkouts = !workoutsQuery || workoutsQuery.records.length === 0;

  return (
    <>
      <Title>Workouts</Title>
      {noWorkouts && (
        <EmptyWorkoutsPlaceholder
          onAddClick={() => createWorkoutAndRedirect()}
        />
      )}
      <div className="pb-24">
        {workoutsQuery?.records.map((w) => (
          <Workout
            key={w.id}
            id={w.id}
            name={w.name}
            onStartWorkout={handleStartWorkout}
          >
            <WorkoutExercises exercises={w.exercises} />
          </Workout>
        ))}
      </div>
      <FabContainer>
        <IconButton
          color="primary"
          variant="solid"
          onClick={() => createWorkoutAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer>
    </>
  );
}
