"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { QueryResponse, WorkoutModel } from "@local/database";
import { Button, Chip } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  EditIcon,
  HistoryIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { EmptyWorkoutsPlaceholder } from "./components/empty-workouts-placeholder";
import { Workout } from "./components/workout";
import { WorkoutExercises } from "./components/workout/workout-exercises";
import { useCallback } from "react";
import { startWorkoutAndRedirect } from "@/server/workouts/start-workout";

export default function WorkoutsPage() {
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
    <PageContainer>
      <MainContainer className="px-2">
        <div className="text-xl mb-3">Workouts</div>
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
          <Button
            isIconOnly
            variant="solid"
            radius="full"
            size="sm"
            color="primary"
            onClick={() => createWorkoutAndRedirect()}
          >
            <ActivityIcon size={16} />
          </Button>
        </FabContainer>
      </MainContainer>
    </PageContainer>
  );
}
