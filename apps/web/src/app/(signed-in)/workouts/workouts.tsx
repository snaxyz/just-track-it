"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkout, createWorkoutAndSessionAndRedirect } from "@/server/workouts";
import { ChatMessageModel, ExerciseModel, QueryResponse, WorkoutModel, WorkoutWithRelations } from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIcon, MessageCirclePlusIcon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import {
  CreateWorkoutModal,
  CreateWorkoutModalProps,
  EmptyWorkoutsPlaceholder,
  WorkoutCard,
  WorkoutCardExercises,
  WorkoutCardSkeleton,
} from "@/components/workouts";
import { IconButton } from "@/components/icon-button";
import { Title } from "@/components/title";
import { useCallback, useState } from "react";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { Button } from "@mui/material";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { EditWorkoutModal, EditWorkoutModalProps } from "@/components/workouts/edit-workout-modal";
import { updateWorkout } from "@/server/workouts";
import { WorkoutsLoading } from "./workouts-loading";
import { ChatModal } from "@/components/chat/chat-modal";
import { getChatMessages } from "@/app/api/chat/[id]/messages/get-chat-messages";

export function Workouts() {
  const queryClient = useQueryClient();
  const { data: workoutsQuery, isLoading } = useQuery<QueryResponse<WorkoutWithRelations>>({
    queryKey: ["workouts"],
    queryFn: () => getWorkouts(),
  });

  const { data: exercisesQuery } = useQuery<QueryResponse<ExerciseModel>>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  // TODO: Replace with actual chat ID
  const chatId = "a19ac188-44df-4c52-8b28-83442ac5f63f";

  const { data: chatMessagesQuery } = useQuery<QueryResponse<ChatMessageModel>>({
    queryKey: ["chat-messages", chatId],
    queryFn: () => getChatMessages(chatId),
  });

  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutSessionAndRedirect(workoutId);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkout: CreateWorkoutModalProps["onCreate"] = async (input) => {
    setIsCreating(true);
    const workout = await createWorkout(input.name, input.description, input.selectedExercises);
    setIsCreating(false);

    queryClient.setQueryData<QueryResponse<Omit<WorkoutWithRelations, "sessions">>>(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: [...(workoutsQuery?.records ?? []), workout],
    });
  };

  const [selectedWorkout, setSelectedWorkout] =
    useState<Pick<WorkoutWithRelations, "id" | "name" | "description" | "exercises">>();

  const handleEditWorkout = (id: string) => {
    setSelectedWorkout(workoutsQuery?.records?.find((w) => w.id === id));
  };
  const onCloseEditWorkout = () => setSelectedWorkout(undefined);

  const handleSaveWorkout: EditWorkoutModalProps["onSave"] = async (input) => {
    const workoutId = selectedWorkout?.id ?? "";
    queryClient.setQueryData(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: workoutsQuery?.records.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              name: input.name,
              description: input.description,
              exercises: input.selectedExercises.map((e) => ({
                exerciseId: e.id,
                exercise: { name: e.name },
              })),
            }
          : w,
      ),
    });
    const workout = await updateWorkout(workoutId, input.name, input.description ?? "", input.selectedExercises);

    queryClient.setQueryData<QueryResponse<WorkoutWithRelations>>(["workouts"], {
      ...(workoutsQuery ?? { cursor: "" }),
      records: workoutsQuery?.records.map((w) => (w.id === workoutId ? { ...w, ...workout } : w)) ?? [],
    });

    onCloseEditWorkout();
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const onOpenChat = () => setIsChatOpen(true);
  const onCloseChat = () => setIsChatOpen(false);

  if (isLoading) return <WorkoutsLoading />;

  const noWorkouts = !workoutsQuery || workoutsQuery.records.length === 0;

  return (
    <>
      <div className="px-1">
        <Title>Workouts</Title>
      </div>
      {noWorkouts && <EmptyWorkoutsPlaceholder onAddClick={onOpen} onAskAIClick={onOpenChat} />}
      <div className="pb-24">
        {workoutsQuery?.records.map((w) => (
          <WorkoutCard
            key={w.id}
            id={w.id}
            name={w.name}
            description={w.description}
            onStartWorkout={handleStartWorkout}
            onEditClick={handleEditWorkout}
          >
            <WorkoutCardExercises exercises={w.exercises ?? []} />
          </WorkoutCard>
        ))}
        {isCreating && <WorkoutCardSkeleton />}
        {!noWorkouts && (
          <div className="p-2">
            <Button variant="contained" startIcon={<PlusIcon size={16} />} onClick={onOpen} color="primary" fullWidth>
              Create new workout
            </Button>
          </div>
        )}
      </div>
      <FabContainer>
        <IconButton color="primary" onClick={onOpenChat}>
          <MessageSquarePlusIcon size={22} />
        </IconButton>
      </FabContainer>
      <CreateWorkoutModal
        isOpen={isOpen}
        onClose={onClose}
        exercises={exercisesQuery?.records ?? []}
        onCreate={handleCreateWorkout}
      />
      <EditWorkoutModal
        isOpen={Boolean(selectedWorkout)}
        onClose={onCloseEditWorkout}
        workout={selectedWorkout}
        exercises={exercisesQuery?.records ?? []}
        onSave={handleSaveWorkout}
      />
      <ChatModal
        isOpen={isChatOpen}
        onClose={onCloseChat}
        chatId={chatId}
        messages={chatMessagesQuery?.records ?? []}
      />
    </>
  );
}
