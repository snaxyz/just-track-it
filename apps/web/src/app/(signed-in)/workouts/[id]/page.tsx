"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { ListCheckIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { NewSetModal, NewSetModalProps } from "./components/new-set-modal";
import { useCallback, useState } from "react";
import {
  ExerciseModel,
  QueryResponse,
  WorkoutHistoryExercise,
  WorkoutHistoryExerciseSet,
  WorkoutModel,
} from "@local/database";
import { useUserId } from "@/lib/hooks/use-user";
import {
  LastWorkoutExerciseSet,
  WorkoutExercise,
} from "./components/workout-exercise";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EnhancedWorkoutHistoryModel,
  getWorkoutHistory,
} from "@/app/api/history/[id]/get-workout-history";
import { EmptyExercisesPlaceholder } from "./components/empty-exercises-placeholder";
import { IconButton } from "@/components/icon-button";
import {
  updateWorkoutExercises,
  updateWorkoutHistoryExercises,
  updateWorkoutHistoryName,
  updateWorkoutName,
} from "@/server/workouts";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { createExercise } from "@/server/exercises/create-exercise";

export default function WorkoutPage() {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const { data: workout, isLoading: isWorkoutLoading } =
    useQuery<EnhancedWorkoutHistoryModel>({
      queryKey: ["history", id],
      queryFn: () => getWorkoutHistory(id),
    });
  const { data: exercisesQuery, isLoading: isExercisesLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });
  const isLoading = isWorkoutLoading || isExercisesLoading;

  const { isOpen, onClose, onOpen } = useDisclosure();

  // TODO: use last workout exercise stats
  const [selectedExercise, setSelectedExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [set, setSet] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const workoutExercises = workout?.exercises ?? [];

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = workoutExercises.find((e) => e.exerciseId === exerciseId);
    if (exercise) {
      setSet((exercise.sets.length + 1).toString());
      setReps(exercise.sets[exercise.sets.length - 1].reps.toString());
      const weight = exercise.sets[exercise.sets.length - 1].weight;
      if (weight) {
        setWeight(weight.toString());
      } else {
        setWeight("");
      }
      setCustomExercise(exercise.exerciseName);
    }
    setSelectedExercise(exerciseId);
  };

  const handleCustomExerciseChange = (exercise: string) => {
    setCustomExercise(exercise);

    const found = exercisesQuery?.records.find(
      (e) => e.name.toLowerCase() === exercise.trim().toLowerCase()
    );
    if (found) {
      setSelectedExercise(found.id);
      const workout = workoutExercises.find((e) => e.exerciseId === found.id);
      if (workout) {
        setSet((workout.sets.length + 1).toString());
        setReps(workout.sets[workout.sets.length - 1].reps.toString());
        const weight = workout.sets[workout.sets.length - 1].weight;
        if (weight) {
          setWeight(weight.toString());
        } else {
          setWeight("");
        }
      } else {
        // TODO: if worked out before, get last stats
        setSet("1");
        setReps("5");
        setWeight("2.5");
      }
    } else {
      // TODO: if worked out before, get last stats
      setSet("1");
      setReps("5");
      setWeight("2.5");
    }
  };

  const handleAddNewSet: NewSetModalProps["onAdd"] = async (input) => {
    let exercise: ExerciseModel | undefined = undefined;
    if (input.selectedExercise) {
      exercise = exercisesQuery?.records.find(
        (e) => e.id === input.selectedExercise
      )!;
      setLastUpdatedExercise(exercise.id);
    }
    if (input.customExercise) {
      const matchedExercise = exercisesQuery?.records.find(
        (e) =>
          e.name.toLowerCase() === input.customExercise?.trim().toLowerCase()
      );
      if (matchedExercise) {
        exercise = matchedExercise;
      } else {
        exercise = await createExercise(input.customExercise.trim());
        queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
          ...(exercisesQuery ?? { cursor: "" }),
          records: [...(exercisesQuery?.records ?? []), exercise],
        });
      }
      setLastUpdatedExercise(exercise.id);
    }
    if (!workout || !exercise) return;
    let updatedWorkoutExercises: WorkoutHistoryExercise[];
    if (input.set === "1") {
      updatedWorkoutExercises = [
        ...workoutExercises,
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets: [
            {
              reps: parseInt(input.reps),
              weight: parseFloat(input.weight),
              unit: input.unit,
            },
          ],
        },
      ];
      updateWorkoutHistoryExercises(workout.id, updatedWorkoutExercises);
    } else {
      updatedWorkoutExercises = workoutExercises.map((e) => {
        if (e.exerciseId === exercise.id) {
          return {
            ...e,
            sets: [
              ...e.sets,
              {
                reps: parseInt(input.reps),
                weight: parseFloat(input.weight),
                unit: input.unit,
              },
            ],
          };
        }
        return e;
      });
      updateWorkoutHistoryExercises(workout.id, updatedWorkoutExercises);
    }
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
    setSet((parseInt(input.set) + 1).toString());
  };

  const handleWorkoutExerciseClick = (exerciseId: string) => {
    handleSelectExercise(exerciseId);
    onOpen();
  };

  const [lastUpdatedExercise, setLastUpdatedExercise] = useState("");
  const onAnimationComplete = useCallback(() => setLastUpdatedExercise(""), []);
  const handleDeleteExercise = (exerciseId: string) => {
    if (!workout) return;
    const updatedWorkoutExercises = workoutExercises.filter(
      (e) => e.exerciseId !== exerciseId
    );
    updateWorkoutHistoryExercises(workout.id, updatedWorkoutExercises);
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
  };
  const handleDeleteExerciseSet = (exerciseId: string, setIndex: number) => {
    if (!workout) return;
    const updatedWorkoutExercises = workoutExercises.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex),
        };
      }
      return exercise;
    });
    updateWorkoutHistoryExercises(workout.id, updatedWorkoutExercises);
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
  };
  const handleUpdateExerciseSet = (
    exerciseId: string,
    setIndex: number,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => {
    if (!workout) return;
    const updatedWorkoutExercises = workoutExercises.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, index) =>
            index === setIndex ? { ...set, ...updates } : set
          ),
        };
      }
      return exercise;
    });
    updateWorkoutHistoryExercises(workout.id, updatedWorkoutExercises);
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
  };

  const handleComplete = async () => {
    if (!workout) return;
    if (workout.isNew) {
      const updatedWorkout = await updateWorkoutExercises(
        workout.workoutId,
        workoutExercises.map((e) => ({
          exerciseId: e.exerciseId,
          exerciseName: e.exerciseName,
        }))
      );
      const cachedWorkouts = queryClient.getQueryData<
        QueryResponse<WorkoutModel>
      >(["workouts"]) ?? {
        records: [],
        cursor: "",
      };
      const updatedWorkouts: QueryResponse<WorkoutModel> = {
        ...cachedWorkouts,
        records: [...cachedWorkouts.records, updatedWorkout],
      };
      queryClient.setQueryData(["workouts"], updatedWorkouts);
    }

    redirect("/workouts");
  };

  const debouncedUpdateWorkoutName = useDebouncedCallback(
    updateWorkoutName,
    500
  );
  const debouncedUpdateWorkoutHistoryName = useDebouncedCallback(
    updateWorkoutHistoryName,
    500
  );

  const handleNameChange = async (updatedName: string) => {
    if (!workout?.workoutId) return;
    queryClient.setQueryData<EnhancedWorkoutHistoryModel>(["history", id], {
      ...workout,
      workoutName: updatedName,
    });
    const promises = [
      debouncedUpdateWorkoutHistoryName(workout.id, updatedName),
    ];
    if (workout.isNew) {
      debouncedUpdateWorkoutName(workout.workoutId, updatedName);
    }
    await Promise.all(promises);
  };

  const handleStartWorkoutExercise = (exerciseId: string) => {
    setLastUpdatedExercise(exerciseId);
    onOpen();
  };

  // TODO: add SSR, prefetch queries, and better loading states
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <PageContainer>
        <MainContainer className="px-2">
          <Input
            className="text-xl my-3"
            label="Workout"
            variant="faded"
            value={workout?.workoutName ?? ""}
            onValueChange={handleNameChange}
          />
          <div className="pb-24">
            {workoutExercises.length === 0 && (
              <EmptyExercisesPlaceholder onAddClick={onOpen} />
            )}
            {workoutExercises.map((e) => (
              <WorkoutExercise
                key={e.exerciseId}
                className="mb-3 bg-zinc-200 dark:bg-zinc-800 z-0"
                exerciseName={e.exerciseName}
                exerciseId={e.exerciseId}
                showUpdateAnimation={e.exerciseId === lastUpdatedExercise}
                onAnimationComplete={onAnimationComplete}
                sets={e.sets}
                onDelete={handleDeleteExercise}
                onDeleteSet={handleDeleteExerciseSet}
                onUpdateSet={handleUpdateExerciseSet}
              >
                {e.sets.length > 0 ? (
                  <LastWorkoutExerciseSet
                    exerciseId={e.exerciseId}
                    set={e.sets.length}
                    reps={e.sets[e.sets.length - 1].reps}
                    weight={e.sets[e.sets.length - 1].weight}
                    unit={e.sets[e.sets.length - 1].unit}
                    onClick={handleWorkoutExerciseClick}
                  />
                ) : (
                  <div className="p-2">
                    <Button
                      variant="flat"
                      startContent={<PlusIcon size={16} />}
                      size="sm"
                      radius="full"
                      color="secondary"
                      fullWidth
                      onClick={() => handleStartWorkoutExercise(e.exerciseId)}
                    >
                      Start workout exercise
                    </Button>
                  </div>
                )}
              </WorkoutExercise>
            ))}
            <div className="mt-6 flex justify-end gap-2">
              {workoutExercises.length > 0 && (
                <Button
                  size="sm"
                  radius="full"
                  color="secondary"
                  variant="flat"
                  startContent={<ListCheckIcon size={16} />}
                  onClick={handleComplete}
                >
                  Complete
                </Button>
              )}
              <IconButton variant="bordered">
                <MoreVerticalIcon size={16} />
              </IconButton>
            </div>
          </div>
          <FabContainer>
            <Button
              isIconOnly
              variant="solid"
              radius="full"
              size="sm"
              color="primary"
              onClick={onOpen}
            >
              <PlusIcon size={16} />
            </Button>
          </FabContainer>
        </MainContainer>
      </PageContainer>
      <NewSetModal
        isOpen={isOpen}
        onClose={onClose}
        exercises={exercisesQuery?.records ?? []}
        onAdd={handleAddNewSet}
        selectedExercise={selectedExercise}
        customExercise={customExercise}
        set={set}
        reps={reps}
        weight={weight}
        onSelectedExerciseChange={handleSelectExercise}
        onCustomExerciseChange={handleCustomExerciseChange}
        onSetChange={setSet}
        onRepsChange={setReps}
        onWeightChange={setWeight}
        unit="lbs"
      />
    </>
  );
}
