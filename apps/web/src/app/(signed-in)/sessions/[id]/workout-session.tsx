"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { Button, TextField, Box, IconButton, Fab } from "@mui/material";
import { ListCheckIcon, PlusIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import {
  NewSetModal,
  NewSetModalProps,
  EmptySessionExercisePlaceholder,
  LastWorkoutExerciseSet,
  WorkoutSessionExerciseCard,
} from "@/components/sessions";
import { useCallback, useState } from "react";
import {
  ExerciseModel,
  QueryResponse,
  WorkoutSessionExerciseModel,
  WorkoutModel,
  WeightUnit,
  WorkoutSessionWithRelations,
  WorkoutSessionExerciseWithRelations,
  WorkoutSet,
} from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWorkoutSession } from "@/app/api/workout-sessions/[id]/get-workout-session";
import { updateWorkoutExercises, updateWorkoutName } from "@/server/workouts";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { createExercise } from "@/server/exercises/create-exercise";
import { DateTime } from "@/components/date-time";
import { EnhancedWorkoutSession } from "@/server/types";
import { updateWorkoutSessionExercises } from "@/server/workout-sessions/update-workout-session-exercises";
import { WorkoutSessionLoading } from "./workout-session-loading";

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
  exerciseId: string,
): SetStats {
  if (!lastSession) return defaultStats;
  const lastSessionExercise = lastSession.exercises.find((e) => e.exerciseId === exerciseId);
  const matchingSet = lastSessionExercise?.sets[lastSessionExercise.sets.length - 1];
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
  const { data: workoutSession, isLoading: isWorkoutLoading } = useQuery<EnhancedWorkoutSession>({
    queryKey: ["session", id],
    queryFn: () => getWorkoutSession(id),
  });
  const { data: exercisesQuery, isLoading: isExercisesLoading } = useQuery<QueryResponse<ExerciseModel>>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });
  const isLoading = isWorkoutLoading || isExercisesLoading;

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [selectedExercise, setSelectedExercise] = useState("");
  const [customExercise, setCustomExercise] = useState("");
  const [set, setSet] = useState("1");
  const [reps, setReps] = useState("8");
  const [weight, setWeight] = useState("40");

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

    const found = exercisesQuery?.records.find((e) => e.name.toLowerCase() === exercise.trim().toLowerCase());
    if (found) {
      setSelectedExercise(found.id);
      const workoutExercise = workoutExercises.find((e) => e.exerciseId === found.id);
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
        const lastStats = getLastExerciseSetStats(workoutSession?.lastSession, found.id);
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
      exercise = exercisesQuery?.records.find((e) => e.id === input.selectedExercise)!;
      setLastUpdatedExercise(exercise.id);
    }
    if (input.customExercise) {
      const matchedExercise = exercisesQuery?.records.find(
        (e) => e.name.toLowerCase() === input.customExercise?.trim().toLowerCase(),
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
    let updatedWorkoutExercises: Pick<WorkoutSessionExerciseWithRelations, "exerciseId" | "sets" | "exercise">[];
    if (input.set === "1" && !workoutExercises.find((e) => e.exerciseId === exercise.id)) {
      updatedWorkoutExercises = [
        ...workoutExercises,
        {
          exerciseId: exercise.id,
          exercise,
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
    const updatedWorkoutExercises = workoutExercises.filter((e) => e.exerciseId !== exerciseId);
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
  const handleUpdateExerciseSet = (exerciseId: string, setIndex: number, updates: Partial<WorkoutSet>) => {
    if (!workoutSession) return;
    const updatedWorkoutExercises = workoutExercises.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, ...updates } : set)),
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

  const handleComplete = () => {
    redirect("/");
  };

  const debouncedUpdateWorkoutName = useDebouncedCallback(updateWorkoutName, 500);

  const handleNameChange = async (updatedName: string) => {
    if (!workoutSession?.workoutId) return;
    queryClient.setQueryData<EnhancedWorkoutSession>(["session", id], {
      ...workoutSession,
      workout: {
        ...workoutSession.workout,
        name: updatedName,
      },
    });
    if (!updatedName) return; // don't save empty name
    if (workoutSession.isNew) {
      debouncedUpdateWorkoutName(workoutSession.workoutId, updatedName);
    }
  };

  const handleStartWorkoutExercise = (exerciseId: string, exerciseName: string) => {
    if (exercisesQuery?.records.find((e) => e.id === exerciseId)) {
      setSelectedExercise(exerciseId);
    }
    setCustomExercise(exerciseName);
    setSet("1");
    const lastStats = getLastExerciseSetStats(workoutSession?.lastSession, exerciseId);
    setReps(lastStats.reps.toString());
    setWeight(lastStats.weight.toString());
    onOpen();
  };

  if (isLoading) return <WorkoutSessionLoading />;

  return (
    <>
      <TextField
        sx={{ typography: "h6", my: 3 }}
        label="Workout"
        variant="outlined"
        value={workoutSession?.workout.name ?? ""}
        onChange={(e) => handleNameChange(e.target.value)}
        disabled={!workoutSession?.isNew ?? true}
        fullWidth
      />
      <Box sx={{ pb: 3 }}>
        {workoutExercises.length === 0 && <EmptySessionExercisePlaceholder onAddClick={onOpen} />}
        {workoutExercises.map((e) => (
          <WorkoutSessionExerciseCard
            key={e.exerciseId}
            sx={{ mb: 3 }}
            exerciseName={e.exercise.name}
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
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    color: "text.secondary",
                    typography: "caption",
                    fontStyle: "italic",
                    mb: 2,
                  }}
                >
                  No sets yet. Add one to start tracking.
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<PlusIcon size={16} />}
                  color="primary"
                  fullWidth
                  onClick={() => handleStartWorkoutExercise(e.exerciseId, e.exercise.name)}
                >
                  Add set
                </Button>
              </Box>
            )}
          </WorkoutSessionExerciseCard>
        ))}
        <Box sx={{ mt: 3 }}>
          {workoutExercises.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Button variant="contained" startIcon={<PlusIcon size={16} />} color="primary" fullWidth onClick={onOpen}>
                Add exercise
              </Button>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<ListCheckIcon size={16} />}
                  onClick={handleComplete}
                >
                  Complete workout
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
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
