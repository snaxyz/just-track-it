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
  WorkoutSessionExerciseModel,
  WorkoutSetModel,
  WorkoutModel,
  WorkoutSessionModel,
  WeightUnit,
  WorkoutSessionWithRelations,
} from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkoutSession } from "@/app/api/workout-sessions/[id]/get-workout-session";
import { IconButton } from "@/components/icon-button";
import {
  updateWorkoutExercises,
  updateWorkoutSessionExercises,
  updateWorkoutName,
} from "@/server/workouts";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { createExercise } from "@/server/exercises/create-exercise";
import { DateTime } from "@/components/date-time";
import { EnhancedWorkoutSession } from "@/app/api/workout-sessions/[id]/get-workout-session";

interface SetStats {
  reps: number;
  weight: number;
  unit?: WeightUnit;
}

const defaultReps = 5;
const defaultWeight = 40;
const defaultUnit: WeightUnit = "lbs";
const defaultStats = {
  reps: defaultReps,
  weight: defaultWeight,
  unit: defaultUnit,
};

function getLastExerciseSetStats(
  lastSession: WorkoutSessionWithRelations | undefined | null,
  exerciseId: string
): SetStats {
  if (!lastSession) return defaultStats;
  const lastSessionExercise = lastSession.exercises.find(
    (e) => e.exerciseId === exerciseId
  );
  const matchingSet =
    lastSessionExercise?.sets[lastSessionExercise.sets.length - 1];
  if (matchingSet) {
    return {
      reps: matchingSet.reps ?? defaultReps,
      weight: matchingSet.weight ?? defaultWeight,
      unit: matchingSet.unit ?? defaultUnit,
    };
  }
  return defaultStats;
}

export function WorkoutSession() {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const { data: workoutSession, isLoading: isWorkoutLoading } =
    useQuery<EnhancedWorkoutSession>({
      queryKey: ["session", id],
      queryFn: () => getWorkoutSession(id),
    });
  const { data: exercisesQuery, isLoading: isExercisesLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });
  const isLoading = isWorkoutLoading || isExercisesLoading;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selectedExercise, setSelectedExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [set, setSet] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const workoutExercises = workoutSession?.exercises ?? [];

  const handleSelectExercise = (exerciseId: string) => {
    const exercise = workoutExercises.find((e) => e.exerciseId === exerciseId);
    if (exercise) {
      setSet((exercise.sets.length + 1).toString());
      const lastSet = exercise.sets[exercise.sets.length - 1];
      if (lastSet && lastSet.reps) {
        setReps(lastSet.reps.toString());
      }
      const weight = exercise.sets[exercise.sets.length - 1].weight;
      if (weight) {
        setWeight(weight.toString());
      } else {
        setWeight("");
      }
      setCustomExercise(exercise.exercise.name);
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
      const workoutExercise = workoutExercises.find(
        (e) => e.exerciseId === found.id
      );
      if (workoutExercise) {
        setSet((workoutExercise.sets.length + 1).toString());
        const lastSet = workoutExercise.sets[workoutExercise.sets.length - 1];
        if (lastSet && lastSet.reps) {
          setReps(lastSet.reps.toString());
        }
        const weight = lastSet?.weight;
        if (weight) {
          setWeight(weight.toString());
        } else {
          setWeight("");
        }
      } else {
        const lastStats = getLastExerciseSetStats(
          workoutSession?.lastSession,
          found.id
        );
        setSet("1");
        setReps(lastStats.reps.toString());
        setWeight(lastStats.weight.toString());
      }
    } else {
      setSet("1");
      setReps(defaultStats.reps.toString());
      setWeight(defaultStats.weight.toString());
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
        setLastUpdatedExercise(exercise.id);
        queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
          ...(exercisesQuery ?? { cursor: "" }),
          records: [...(exercisesQuery?.records ?? []), exercise],
        });
      }
      setLastUpdatedExercise(exercise.id);
    }
    if (!workoutSession || !exercise) return;
    const inputWeight = input.weight ? input.weight : null;
    let updatedWorkoutExercises: WorkoutSessionExerciseModel[];
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
              weight: inputWeight ? parseFloat(inputWeight) : undefined,
              unit: input.unit,
            },
          ],
        },
      ];
      updateWorkoutSessionExercises(workoutSession.id, updatedWorkoutExercises);
    } else {
      updatedWorkoutExercises = workoutExercises.map((e) => {
        if (e.exerciseId === exercise.id) {
          return {
            ...e,
            sets: [
              ...e.sets,
              {
                reps: parseInt(input.reps),
                weight: inputWeight ? parseFloat(inputWeight) : undefined,
                unit: input.unit,
              },
            ],
          };
        }
        return e;
      });
      updateWorkoutSessionExercises(workoutSession.id, updatedWorkoutExercises);
    }
    queryClient.setQueryData(["session", workoutSession.id], {
      ...workoutSession,
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
    if (!workoutSession) return;
    const updatedWorkoutExercises = workoutExercises.filter(
      (e) => e.exerciseId !== exerciseId
    );
    updateWorkoutSessionExercises(workoutSession.id, updatedWorkoutExercises);
    queryClient.setQueryData(["session", workoutSession.id], {
      ...workoutSession,
      exercises: updatedWorkoutExercises,
    });
  };
  const handleDeleteExerciseSet = (exerciseId: string, setIndex: number) => {
    if (!workoutSession) return;
    const updatedWorkoutExercises = workoutExercises.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex),
        };
      }
      return exercise;
    });
    updateWorkoutSessionExercises(workoutSession.id, updatedWorkoutExercises);
    queryClient.setQueryData(["session", workoutSession.id], {
      ...workoutSession,
      exercises: updatedWorkoutExercises,
    });
  };
  const handleUpdateExerciseSet = (
    exerciseId: string,
    setIndex: number,
    updates: Partial<WorkoutSetModel>
  ) => {
    if (!workoutSession) return;
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
    updateWorkoutSeessionExerciseModels(
      workoutSession.id,
      updatedWorkoutExercises
    );
    queryClient.setQueryData(["session", workoutSession.id], {
      ...workoutSession,
      exercises: updatedWorkoutExercises,
    });
  };

  const handleComplete = async () => {
    if (!workoutSession) return;
    const updatedWorkout = await updateWorkoutExercises(
      workoutSession.workoutId,
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
    const updatedWorkouts: QueryResponse<WorkoutModel> = workoutSession.isNew
      ? {
          ...cachedWorkouts,
          records: [...cachedWorkouts.records, updatedWorkout],
        }
      : {
          ...cachedWorkouts,
          records: cachedWorkouts.records.map((w) =>
            w.id === workoutSession.workoutId ? updatedWorkout : w
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
    if (!workoutSession?.workoutId) return;
    queryClient.setQueryData<EnhancedWorkoutSessionModel>(["session", id], {
      ...workoutSession,
      workoutName: updatedName,
    });
    if (!updatedName) return; // don't save empty name
    const promises = [
      debouncedUpdateWorkoutHistoryName(workoutSession.id, updatedName),
    ];
    if (workoutSession.isNew) {
      debouncedUpdateWorkoutName(workoutSession.workoutId, updatedName);
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
    const lastStats = getLastExerciseSetStats(
      workoutSession?.lastSession,
      exerciseId
    );
    setReps(lastStats.reps.toString());
    setWeight(lastStats.weight.toString());
    onOpen();
  };

  // TODO: add SSR, prefetch queries, and better loading states
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      {workoutSession && (
        <div className="mb-2 text-caption-light dark:text-caption text-xs">
          <DateTime iso={workoutSession.date} />
        </div>
      )}
      <Input
        className="text-xl my-3"
        label="Workout"
        variant="faded"
        value={workoutSession?.workoutName ?? ""}
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
                onPress={handleWorkoutExerciseClick}
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
                  onPress={() =>
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
                className="mb-2"
                size="md"
                radius="lg"
                color="primary"
                variant="flat"
                fullWidth
                startContent={<PlusIcon size={16} />}
                onPress={onOpen}
              >
                Add exercise set
              </Button>
              <Button
                size="md"
                radius="lg"
                color="secondary"
                variant="flat"
                fullWidth
                startContent={<ListCheckIcon size={16} />}
                onPress={handleComplete}
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
        <IconButton variant="solid" color="primary" onPress={onOpen}>
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
