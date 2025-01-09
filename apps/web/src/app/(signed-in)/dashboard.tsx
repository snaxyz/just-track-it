"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { Title } from "@/components/title";
import { createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import {
  ChatMessageModel,
  QueryResponse,
  WorkoutSessionWithRelations,
} from "@local/db";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  DumbbellIcon,
  HistoryIcon,
  SquareLibraryIcon,
} from "lucide-react";
import Link from "next/link";
import { DateTime } from "@/components/date-time";
import { getWorkoutSessions } from "../api/workout-sessions/get-workout-sessions";
import { EmptySessionsPlaceholder } from "@/components/sessions";
import { GradientCard } from "@/components/cards";
import { ChatModal } from "@/components/chat/chat-modal";
import { getChatMessages } from "../api/chat/[id]/messages/get-chat-messages";

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

  // TODO: Replace with actual chat ID
  const chatId = "a19ac188-44df-4c52-8b28-83442ac5f63f";

  const { data: chatMessagesQuery, isLoading: chatLoading } = useQuery<
    QueryResponse<ChatMessageModel>
  >({
    queryKey: ["chat-messages", chatId],
    queryFn: () => getChatMessages(chatId),
  });

  const {
    isOpen: isChatOpen,
    onOpen: onOpenChat,
    onClose: onCloseChat,
  } = useDisclosure();

  const noWorkoutSessions =
    workoutSessionsQuery?.pages[0]?.records.length === 0;

  return (
    <>
      <div className="pb-24">
        <section className="mb-6">
          <div className="px-1">
            <Title className="text-lg">Recent workouts</Title>
          </div>
          <div className="space-y-3">
            {workoutSessionsQuery?.pages[0]?.records.length === 0 && (
              <EmptySessionsPlaceholder
                onAddClick={handleStartTraining}
                onAskAIClick={onOpenChat}
              />
            )}
            {workoutSessionsQuery?.pages.map((p) =>
              p.records.map((w) => (
                <GradientCard
                  key={w.id}
                  className="mb-3 z-0"
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
                      variant="bordered"
                      startContent={<ActivityIcon size={16} />}
                      radius="lg"
                      color="secondary"
                      onPress={() => handleStartWorkout(w.workoutId!)}
                    >
                      Start workout
                    </Button>
                  </CardBody>
                </GradientCard>
              ))
            )}
            {isFetchingNextPage && (
              <GradientCard className="mb-3 z-0" shadow="none" fullWidth>
                <CardHeader className="capitalize pb-0">
                  <Skeleton className="h-6 rounded-lg grow bg-stone-100 dark:bg-stone-800"></Skeleton>
                </CardHeader>
                <CardBody>
                  <Skeleton className="h-12 rounded-lg grow bg-stone-100 dark:bg-stone-800" />
                </CardBody>
              </GradientCard>
            )}
          </div>
          <div className="mt-6">
            {hasNextPage && (
              <div className="p-2">
                <Button
                  radius="lg"
                  variant="bordered"
                  color="secondary"
                  fullWidth
                  isDisabled={isFetchingNextPage}
                  onPress={() => fetchNextPage()}
                >
                  View more
                </Button>
              </div>
            )}
            {/* {workoutSessionsQuery?.pages[0]?.records.length !== 0 && (
              <div className="p-2">
                <Button
                  variant="solid"
                  startContent={<ActivityIcon size={16} />}
                  onPress={() => createWorkoutAndSessionAndRedirect()}
                  radius="lg"
                  color="primary"
                  fullWidth
                >
                  Create &amp; start new workout
                </Button>
              </div>
            )} */}
          </div>
        </section>
      </div>
      {/* <FabContainer>
        <IconButton
          color="primary"
          variant="solid"
          onPress={() => createWorkoutAndSessionAndRedirect()}
        >
          <ActivityIcon size={16} />
        </IconButton>
      </FabContainer> */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={onCloseChat}
        chatId={chatId}
        messages={chatMessagesQuery?.records ?? []}
      />
    </>
  );
}
