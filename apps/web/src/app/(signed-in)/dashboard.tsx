"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { Title } from "@/components/title";
import { createWorkoutSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { QueryResponse, WorkoutSessionModel } from "@local/database";
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

export function Dashboard() {
  const {
    data: workoutSessionsQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<QueryResponse<WorkoutSessionModel>>({
    queryKey: ["workout-sessions"],
    queryFn: getWorkoutSessions,
    initialPageParam: undefined,
    getNextPageParam: (lastRes) => lastRes.cursor,
  });

  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutSessionAndRedirect(workoutId);
  }, []);

  return (
    <>
      <div className="pb-24">
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
                      title={w.workoutName}
                    >
                      {w.workoutName}
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
                      Completed on <DateTime iso={w.date} />
                    </div>
                    <Button
                      fullWidth
                      variant="flat"
                      startContent={<ActivityIcon size={16} />}
                      size="sm"
                      radius="lg"
                      color="secondary"
                      onClick={() => handleStartWorkout(w.workoutId)}
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
          {hasNextPage && (
            <div className="mt-6 p-2">
              <Button
                radius="lg"
                variant="flat"
                color="secondary"
                fullWidth
                isDisabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                View more
              </Button>
            </div>
          )}
        </section>
      </div>
      <FabContainer>
        <IconButton
          color="primary"
          variant="solid"
          onClick={() => createWorkoutSessionAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer>
    </>
  );
}
