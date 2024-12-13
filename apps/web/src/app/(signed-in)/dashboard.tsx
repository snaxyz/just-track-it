"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { Title } from "@/components/title";
import { createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import {
  QueryResponse,
  WorkoutSessionModel,
  WorkoutSessionWithRelations,
} from "@local/db";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { getWorkoutSessions } from "../api/workout-sessions/get-workout-sessions";
import { DateTime } from "@/components/date-time";
import workoutsSrc from "./workouts.jpg";
import startTrainingSrc from "./start-training-2.jpg";
import Image from "next/image";

export function Dashboard() {
  const {
    data: workoutSessionsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<QueryResponse<WorkoutSessionWithRelations>>({
    queryKey: ["workout-sessions"],
    queryFn: getWorkoutSessions,
    initialPageParam: undefined,
    getNextPageParam: (lastRes) => lastRes.cursor,
  });

  const handleStartWorkout = (workoutId: string) => {
    startWorkoutSessionAndRedirect(workoutId);
  };

  const handleStartTraining = () => {
    createWorkoutAndSessionAndRedirect();
  };

  return (
    <>
      <div className="pb-24">
        <section className="mb-6 flex items-center gap-2">
          <Card className="z-0 basis-1/3 h-[150px]" as={Link} href="/workouts">
            <CardHeader className="absolute z-10 top-1 text-white">
              Workouts
            </CardHeader>
            <Image
              alt="Goto workouts"
              className="z-0 w-full h-full object-cover"
              src={workoutsSrc}
            />
          </Card>
          <Card
            className="z-0 basis-2/3 h-[150px]"
            fullWidth
            isPressable
            onPress={handleStartTraining}
          >
            <CardHeader className="absolute z-10 top-1 text-white">
              Start training
            </CardHeader>
            <Image
              alt="Star training"
              className="z-0 w-full h-full object-cover"
              src={startTrainingSrc}
            />
          </Card>
        </section>
        <section className="mb-6">
          <Title className="text-lg">Recent workouts</Title>
          <div className="space-y-3">
            {workoutSessionsQuery?.pages.map((p) =>
              p.records.map((w) => (
                <Card
                  key={w.id}
                  className="mb-3 bg-zinc-200 dark:bg-zinc-800 z-0"
                  shadow="none"
                  fullWidth
                >
                  <CardHeader className="capitalize pb-0">
                    <span
                      className="text-nowrap text-ellipsis overflow-hidden mr-2"
                      title={w.workout.name}
                    >
                      {w.workout.name}
                    </span>
                    <Grow />
                    <IconButton
                      as={Link}
                      href={`/workouts/${w.workoutId}/history`}
                    >
                      <HistoryIcon size={16} />
                    </IconButton>
                  </CardHeader>
                  <CardBody>
                    <div className="text-caption-light dark:text-caption text-xs mb-2">
                      Completed on <DateTime iso={w.completedAt ?? ""} />
                    </div>
                    <Button
                      fullWidth
                      variant="flat"
                      startContent={<ActivityIcon size={16} />}
                      size="sm"
                      radius="lg"
                      color="secondary"
                      onPress={() => handleStartWorkout(w.workoutId!)}
                    >
                      Start workout
                    </Button>
                  </CardBody>
                </Card>
              ))
            )}
            {isFetchingNextPage && (
              <Card
                className="mb-3 bg-zinc-200 dark:bg-zinc-800 z-0"
                shadow="none"
                fullWidth
              >
                <CardHeader className="capitalize pb-0">
                  <Skeleton className="h-6 rounded-lg grow bg-zinc-300 dark:bg-zinc-700"></Skeleton>
                </CardHeader>
                <CardBody>
                  <Skeleton className="h-12 rounded-lg grow bg-zinc-300 dark:bg-zinc-700" />
                </CardBody>
              </Card>
            )}
          </div>
          <div className="mt-6">
            {hasNextPage && (
              <div className="p-2">
                <Button
                  size="sm"
                  radius="lg"
                  variant="flat"
                  color="secondary"
                  fullWidth
                  isDisabled={isFetchingNextPage}
                  onPress={() => fetchNextPage()}
                >
                  View more
                </Button>
              </div>
            )}
            <div className="p-2">
              <Button
                variant="solid"
                startContent={<ActivityIcon size={16} />}
                size="sm"
                onPress={() => createWorkoutAndSessionAndRedirect()}
                radius="lg"
                color="primary"
                fullWidth
              >
                Create &amp; start new workout
              </Button>
            </div>
          </div>
        </section>
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
    </>
  );
}
