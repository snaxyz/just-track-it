"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
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

export default function WorkoutPage() {
  const userId = useUserId();
  const { id } = useParams();
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

  return (
    <>
      <PageContainer>
        <MainContainer className="px-2">
          <h1 className="text-xl my-3">
            <DateTime iso={today.current.toISOString()} formatType="friendly" />
          </h1>
          <div className="pb-24">
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
