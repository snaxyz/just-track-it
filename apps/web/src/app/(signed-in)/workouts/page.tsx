"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { QueryResponse, WorkoutModel } from "@local/database";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  EditIcon,
  HistoryIcon,
  MoreHorizontalIcon,
  PlayIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { EmptyWorkoutsPlaceholder } from "./components/empty-workouts-placeholder";

export default function WorkoutsPage() {
  const { data: workoutsQuery, isLoading } = useQuery<
    QueryResponse<WorkoutModel>
  >({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

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
        {workoutsQuery?.records.map((w) => (
          <div
            key={w.id}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"
          >
            <div className="flex w-full p-2 gap-2">
              <div>{w.name}</div>
              <Grow />
              <IconButton>
                <HistoryIcon size={16} />
              </IconButton>
              <IconButton>
                <EditIcon size={16} />
              </IconButton>
              <IconButton>
                <MoreHorizontalIcon size={16} />
              </IconButton>
            </div>
            <div className="w-full p-2">
              <Button
                fullWidth
                variant="bordered"
                startContent={<ActivityIcon size={16} />}
                size="sm"
                radius="full"
              >
                Start workout
              </Button>
            </div>
          </div>
        ))}
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
