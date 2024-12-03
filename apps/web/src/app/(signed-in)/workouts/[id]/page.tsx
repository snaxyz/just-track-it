"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { ListCheckIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { NewSetModal, NewSetModalProps } from "./components/new-set-modal";
import { useCallback, useRef, useState } from "react";
import {
  ExerciseModel,
  WorkoutHistoryExercise,
  WorkoutHistoryExerciseSet,
} from "@local/database";
import { nanoid } from "nanoid";
import { currentTimestamp } from "@/lib/timestamp";
import { useUserId } from "@/lib/hooks/use-user";
import {
  LastWorkoutExerciseSet,
  WorkoutExercise,
} from "./components/workout-exercise";
import { DateTime } from "@/components/date-time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EnhancedWorkoutHistoryModel,
  getWorkoutHistory,
} from "@/app/api/history/[id]/get-workout-history";
import { EmptyExercisesPlaceholder } from "./components/empty-exercises-placeholder";
import { IconButton } from "@/components/icon-button";
import { updateWorkoutHistoryName, updateWorkoutName } from "@/server/workouts";
import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";

export default function WorkoutPage() {
  const userId = useUserId();
  const { id } = useParams<{ id: string }>();

  const { data: workout, isLoading } = useQuery<EnhancedWorkoutHistoryModel>({
    queryKey: ["history", id],
    queryFn: () => getWorkoutHistory(id),
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  // TODO: update this to be queried by db
  const [exercises, setExercises] = useState<ExerciseModel[]>([
    {
      id: "bench",
      name: "bench",
      created: "2020",
      updated: "2020",
      userId,
    },
  ]);

  // TODO: use last workout exercise stats
  const [selectedExercise, setSelectedExercise] = useState("bench");
  const [customExercise, setCustomExercise] = useState("bench");
  const [set, setSet] = useState("1");
  const [reps, setReps] = useState("5");
  const [weight, setWeight] = useState("2.5");

  const [workoutExercises, setWorkoutExercises] = useState<
    WorkoutHistoryExercise[]
  >([]);

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

    const found = exercises.find(
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

  const handleAddNewSet: NewSetModalProps["onAdd"] = (input) => {
    let exercise: ExerciseModel;
    if (input.selectedExercise) {
      exercise = exercises.find((e) => e.id === input.selectedExercise)!;
      setLastUpdatedExercise(exercise.id);
    }
    if (input.customExercise) {
      const matchedExercise = exercises.find(
        (e) =>
          e.name.toLowerCase() === input.customExercise?.trim().toLowerCase()
      );
      if (matchedExercise) {
        exercise = matchedExercise;
      } else {
        const ts = currentTimestamp();
        exercise = {
          id: nanoid(),
          created: ts,
          updated: ts,
          userId,
          name: input.customExercise.trim(),
        };
        setExercises((e) => [...e, exercise]);
      }
      setLastUpdatedExercise(exercise.id);
    }
    if (input.set === "1") {
      setWorkoutExercises((e) => [
        ...e,
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
      ]);
    } else {
      setWorkoutExercises((we) =>
        we.map((e) => {
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
        })
      );
    }
    setSet((parseInt(input.set) + 1).toString());
  };

  const handleWorkoutExerciseClick = (exerciseId: string) => {
    handleSelectExercise(exerciseId);
    onOpen();
  };

  const [lastUpdatedExercise, setLastUpdatedExercise] = useState("");
  const onAnimationComplete = useCallback(() => setLastUpdatedExercise(""), []);
  const today = useRef(new Date());
  const handleDeleteExercise = (exerciseId: string) => {
    setWorkoutExercises((e) => e.filter((e) => e.exerciseId !== exerciseId));
  };
  const handleDeleteExerciseSet = (exerciseId: string, setIndex: number) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) => {
        if (exercise.exerciseId === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter((_, index) => index !== setIndex),
          };
        }
        return exercise;
      })
    );
  };
  const handleUpdateExerciseSet = (
    exerciseId: string,
    setIndex: number,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) => {
        if (exercise.exerciseId === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { ...set, ...updates } : set
            ),
          };
        }
        return exercise;
      })
    );
  };

  const handleComplete = () => {
    redirect("/workouts");
  };

  const queryClient = useQueryClient();

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
                <LastWorkoutExerciseSet
                  exerciseId={e.exerciseId}
                  set={e.sets.length}
                  reps={e.sets[e.sets.length - 1].reps}
                  weight={e.sets[e.sets.length - 1].weight}
                  unit={e.sets[e.sets.length - 1].unit}
                  onClick={handleWorkoutExerciseClick}
                />
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
        exercises={exercises}
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
