"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutSessionAndRedirect } from "@/server/workouts";
import { ExerciseModel, QueryResponse, WorkoutModel } from "@local/database";
import { useQuery } from "@tanstack/react-query";
import { ActivityIcon, PlusIcon } from "lucide-react";
import {
  CreateWorkoutModal,
  EmptyWorkoutsPlaceholder,
  WorkoutCard,
  WorkoutCardExercises,
} from "@/components/workouts";
import { IconButton } from "@/components/icon-button";
import { Title } from "@/components/title";
import { useCallback } from "react";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { Button, useDisclosure } from "@nextui-org/react";
import { getExercises } from "@/app/api/exercises/get-exercises";

export function Workouts() {
  const { data: workoutsQuery, isLoading } = useQuery<
    QueryResponse<WorkoutModel>
  >({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

  const { data: exercisesQuery, isLoading: exercisesLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutSessionAndRedirect(workoutId);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <div className="p-2">
          <Button
            variant="solid"
            startContent={<PlusIcon size={16} />}
            size="sm"
            onPress={onOpen}
            radius="lg"
            color="primary"
            fullWidth
          >
            Create new workout
          </Button>
        </div>
      </div>
      <FabContainer>
        <IconButton
          color="primary"
          variant="solid"
          onPress={() => createWorkoutSessionAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer>
      <CreateWorkoutModal
        isOpen={isOpen}
        onClose={onClose}
        exercises={exercisesQuery?.records ?? []}
        onCreate={() => {}}
      />
    </>
  );
}
