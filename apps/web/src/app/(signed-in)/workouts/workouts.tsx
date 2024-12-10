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
import {
  EditWorkoutModal,
  EditWorkoutModalProps,
} from "@/components/workouts/edit-workout-modal";
import { updateWorkout } from "@/server/workouts";

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

  const [selectedWorkout, setSelectedWorkout] =
    useState<Pick<WorkoutModel, "id" | "name" | "description" | "exercises">>();

  const handleEditWorkout = (id: string) => {
    setSelectedWorkout(workoutsQuery?.records?.find((w) => w.id === id));
  };
  const closeEditWorkoutModal = () => setSelectedWorkout(undefined);

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
                exerciseName: e.name,
              })),
            }
          : w
      ),
    });
    const workout = await updateWorkout(
      workoutId,
      input.name,
      input.description,
      input.selectedExercises
    );
    queryClient.setQueryData(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: workoutsQuery?.records.map((w) =>
        w.id === workoutId ? workout : w
      ),
    });

    closeEditWorkoutModal();
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
            onEditClick={handleEditWorkout}
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
        <IconButton color="primary" variant="solid" onPress={onOpen}>
          <PlusIcon size={16} />
        </IconButton>
      </FabContainer>
      <CreateWorkoutModal
        isOpen={isOpen}
        onClose={onClose}
        exercises={exercisesQuery?.records ?? []}
        onCreate={handleCreateWorkout}
      />
      <EditWorkoutModal
        isOpen={Boolean(selectedWorkout)}
        onClose={closeEditWorkoutModal}
        workout={selectedWorkout}
        exercises={exercisesQuery?.records ?? []}
        onSave={handleSaveWorkout}
      />
    </>
  );
}
