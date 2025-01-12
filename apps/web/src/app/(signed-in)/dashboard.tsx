"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { Box, Button, Card, CardContent, Skeleton, IconButton } from "@mui/material";
import { Title } from "@/components/title";
import { createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { ChatMessageModel, QueryResponse, WorkoutSessionWithRelations } from "@local/db";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ActivityIcon, DumbbellIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import { DateTime } from "@/components/date-time";
import { getWorkoutSessions } from "../api/workout-sessions/get-workout-sessions";
import { EmptySessionsPlaceholder } from "@/components/sessions";
import { ChatModal } from "@/components/chat/chat-modal";
import { getChatMessages } from "../api/chat/[id]/messages/get-chat-messages";
import { useState } from "react";

export function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const onOpenChat = () => setIsChatOpen(true);
  const onCloseChat = () => setIsChatOpen(false);

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

  const { data: chatMessagesQuery } = useQuery<QueryResponse<ChatMessageModel>>({
    queryKey: ["chat-messages", chatId],
    queryFn: () => getChatMessages(chatId),
  });

  return (
    <>
      <Box sx={{ pb: 24 }}>
        <Box component="section" sx={{ mb: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {workoutSessionsQuery?.pages[0]?.records.length === 0 && (
              <EmptySessionsPlaceholder onAddClick={handleStartTraining} onAskAIClick={onOpenChat} />
            )}
            {workoutSessionsQuery?.pages.map((p) =>
              p.records.map((w) => (
                <Card key={w.id} variant="outlined" sx={{ mb: 3, zIndex: 0 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          mr: 2,
                        }}
                        title={w.workout.name}
                      >
                        {w.workout.name}
                      </Box>
                      <Box sx={{ flexGrow: 1 }} />
                      <Link href={`/workouts/${w.workoutId}/history`}>
                        <IconButton>
                          <HistoryIcon size={16} />
                        </IconButton>
                      </Link>
                    </Box>
                    <Box
                      sx={{
                        typography: "caption",
                        color: "text.secondary",
                        mb: 2,
                      }}
                    >
                      Completed on <DateTime iso={w.completedAt ?? ""} />
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ActivityIcon size={16} />}
                      color="primary"
                      onClick={() => handleStartWorkout(w.workoutId!)}
                    >
                      Start workout
                    </Button>
                  </CardContent>
                </Card>
              )),
            )}
            {isFetchingNextPage && (
              <Card variant="outlined" sx={{ mb: 3, zIndex: 0 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" height={48} />
                </CardContent>
              </Card>
            )}
          </Box>
          <Box sx={{ mt: 6 }}>
            {hasNextPage && (
              <Box sx={{ p: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  View more
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <ChatModal
        isOpen={isChatOpen}
        onClose={onCloseChat}
        chatId={chatId}
        messages={chatMessagesQuery?.records ?? []}
      />
    </>
  );
}
