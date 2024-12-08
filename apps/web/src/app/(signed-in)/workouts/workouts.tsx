"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import {
  createWorkout,
  createWorkoutAndSessionAndRedirect,
} from "@/server/workouts";
import { ExerciseModel, QueryResponse, WorkoutModel } from "@local/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIcon, PlusIcon } from "lucide-react";
import {
  CreateWorkoutModal,
  CreateWorkoutModalProps,
  EmptyWorkoutsPlaceholder,
  WorkoutCard,
  WorkoutCardExercises,
  WorkoutCardSkeleton,
} from "@/components/workouts";
import { IconButton } from "@/components/icon-button";
import { Title } from "@/components/title";
import { useCallback, useState } from "react";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { Button, useDisclosure } from "@nextui-org/react";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { redirect } from "next/navigation";

export function Workouts() {
  const queryClient = useQueryClient();
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
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkout: CreateWorkoutModalProps["onCreate"] = async (
    input
  ) => {
    setIsCreating(true);
    const workout = await createWorkout(
      input.name,
      input.description,
      input.selectedExercises
    );
    setIsCreating(false);
    queryClient.setQueryData<QueryResponse<WorkoutModel>>(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: [...(workoutsQuery?.records ?? []), workout],
    });
  };

  if (isLoading) return <div>...loading...</div>;

  const noWorkouts = !workoutsQuery || workoutsQuery.records.length === 0;

  return (
    <>
      <Title>Workouts</Title>
      {noWorkouts && (
        <EmptyWorkoutsPlaceholder
          onAddClick={() => createWorkoutAndSessionAndRedirect()}
        />
      )}
      <div className="pb-24">
        {workoutsQuery?.records.map((w) => (
          <WorkoutCard
            key={w.id}
            id={w.id}
            name={w.name}
            description={w.description}
            onStartWorkout={handleStartWorkout}
          >
            <WorkoutCardExercises exercises={w.exercises} />
          </WorkoutCard>
        ))}
        {isCreating && <WorkoutCardSkeleton />}
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
          onPress={() => createWorkoutAndSessionAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer>
      <CreateWorkoutModal
        isOpen={isOpen}
        onClose={onClose}
        exercises={exercisesQuery?.records ?? []}
        onCreate={handleCreateWorkout}
      />
    </>
  );
}
