"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { ListCheckIcon, PlusIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import {
  NewSetModal,
  NewSetModalProps,
  EmptyExercisesPlaceholder,
  LastWorkoutExerciseSet,
  WorkoutExercise,
} from "@/components/sessions";
import { useCallback, useState } from "react";
import {
  ExerciseModel,
  QueryResponse,
  WorkoutSessionExercise,
  WorkoutSessionExerciseSet,
  WorkoutModel,
} from "@local/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EnhancedWorkoutSessionModel,
  getHistory,
} from "@/app/api/history/[id]/get-history";
import { IconButton } from "@/components/icon-button";
import {
  updateWorkoutExercises,
  updateWorkoutSessionExercises,
  updateWorkoutSessionName,
  updateWorkoutName,
} from "@/server/workouts";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { createExercise } from "@/server/exercises/create-exercise";

export function WorkoutSession() {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const { data: workout, isLoading: isWorkoutLoading } =
    useQuery<EnhancedWorkoutSessionModel>({
      queryKey: ["history", id],
      queryFn: () => getHistory(id),
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
        exercise = await createExercise(input.customExercise.trim(), []);
        queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
          ...(exercisesQuery ?? { cursor: "" }),
          records: [...(exercisesQuery?.records ?? []), exercise],
        });
      }
      setLastUpdatedExercise(exercise.id);
    }
    if (!workout || !exercise) return;
    let updatedWorkoutExercises: WorkoutSessionExercise[];
    if (
      input.set === "1" &&
      !workoutExercises.find((e) => e.exerciseId === exercise.id)
    ) {
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
      updateWorkoutSessionExercises(workout.id, updatedWorkoutExercises);
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
      updateWorkoutSessionExercises(workout.id, updatedWorkoutExercises);
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
    updateWorkoutSessionExercises(workout.id, updatedWorkoutExercises);
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
    updateWorkoutSessionExercises(workout.id, updatedWorkoutExercises);
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
  };
  const handleUpdateExerciseSet = (
    exerciseId: string,
    setIndex: number,
    updates: Partial<WorkoutSessionExerciseSet>
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
    updateWorkoutSessionExercises(workout.id, updatedWorkoutExercises);
    queryClient.setQueryData(["history", workout.id], {
      ...workout,
      exercises: updatedWorkoutExercises,
    });
  };

  const handleComplete = async () => {
    if (!workout) return;
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
    const updatedWorkouts: QueryResponse<WorkoutModel> = workout.isNew
      ? {
          ...cachedWorkouts,
          records: [...cachedWorkouts.records, updatedWorkout],
        }
      : {
          ...cachedWorkouts,
          records: cachedWorkouts.records.map((w) =>
            w.id === workout.workoutId ? updatedWorkout : w
          ),
        };
    queryClient.setQueryData(["workouts"], updatedWorkouts);

    redirect("/");
  };

  const debouncedUpdateWorkoutName = useDebouncedCallback(
    updateWorkoutName,
    500
  );
  const debouncedUpdateWorkoutHistoryName = useDebouncedCallback(
    updateWorkoutSessionName,
    500
  );

  const handleNameChange = async (updatedName: string) => {
    if (!workout?.workoutId) return;
    queryClient.setQueryData<EnhancedWorkoutSessionModel>(["history", id], {
      ...workout,
      workoutName: updatedName,
    });
    if (!updatedName) return; // don't save empty name
    const promises = [
      debouncedUpdateWorkoutHistoryName(workout.id, updatedName),
    ];
    if (workout.isNew) {
      debouncedUpdateWorkoutName(workout.workoutId, updatedName);
    }
    await Promise.all(promises);
  };

  const handleStartWorkoutExercise = (
    exerciseId: string,
    exerciseName: string
  ) => {
    if (exercisesQuery?.records.find((e) => e.id === exerciseId)) {
      setSelectedExercise(exerciseId);
    }
    setCustomExercise(exerciseName);
    setSet("1");
    // TODO: set the last rep and weights used
    setReps("5");
    setWeight("2.5");
    onOpen();
  };

  // TODO: add SSR, prefetch queries, and better loading states
  if (isLoading) return <div>loading...</div>;

  return (
    <>
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
                <div className="text-caption-light dark:text-caption text-xs mb-2 italic">
                  No sets yet. Add one to start tracking.
                </div>
                <Button
                  variant="flat"
                  startContent={<PlusIcon size={16} />}
                  size="sm"
                  radius="lg"
                  color="secondary"
                  fullWidth
                  onClick={() =>
                    handleStartWorkoutExercise(e.exerciseId, e.exerciseName)
                  }
                >
                  Add set
                </Button>
              </div>
            )}
          </WorkoutExercise>
        ))}
        <div className="mt-6">
          {workoutExercises.length > 0 && (
            <div className="p-2">
              <Button
                size="md"
                radius="lg"
                color="secondary"
                variant="flat"
                fullWidth
                startContent={<ListCheckIcon size={16} />}
                onClick={handleComplete}
              >
                Complete &amp; save workout
              </Button>
            </div>
          )}
          {/* <IconButton variant="bordered">
                <MoreVerticalIcon size={16} />
              </IconButton> */}
        </div>
      </div>
      <FabContainer>
        <IconButton variant="solid" color="primary" onClick={onOpen}>
          <PlusIcon size={16} />
        </IconButton>
      </FabContainer>
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
