"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { ExerciseModel, QueryResponse } from "@local/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyExercisesPlaceholder } from "./components/empty-workouts-placeholder";
import { Grow } from "@/components/layout/grow";
import { IconButton } from "@/components/icon-button";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { FabContainer } from "@/components/layout/fab-container";
import { NewExerciseModal } from "./components/new-exercise-modal";
import { Chip, useDisclosure } from "@nextui-org/react";
import { createExercise } from "@/server/exercises/create-exercise";
import { deleteExercise } from "@/server/exercises/delete-exercise";
import { Exercise } from "./components/exercise";
import { updateExercise } from "@/server/exercises/update-exercise";

export default function ExercisesPage() {
  const queryClient = useQueryClient();
  const { data: exercisesQuery, isLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleAddExercise = async (name: string, categories: string[]) => {
    const newExercise = await createExercise(name, categories);
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: [...(exercisesQuery?.records ?? []), newExercise],
    });
    onClose();
  };

  const handleUpdateExercise = async (
    exerciseId: string,
    name: string,
    categories: string[]
  ) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              name,
              categories,
            }
          : e
      ),
    });
    await updateExercise(exerciseId, name, categories);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).filter(
        (e) => e.id !== exerciseId
      ),
    });
    await deleteExercise(exerciseId);
  };

  if (isLoading) return <div>...loading...</div>;

  const noExercises = !exercisesQuery || exercisesQuery.records.length === 0;

  return (
    <>
      <PageContainer>
        <MainContainer className="px-2">
          <div className="text-xl mb-3">Exercises</div>
          {noExercises && <EmptyExercisesPlaceholder onAddClick={onOpen} />}
          <div className="pb-24">
            {exercisesQuery?.records.map((e) => (
              <Exercise
                key={e.id}
                className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"
                {...e}
                onUpdate={handleUpdateExercise}
                onDelete={handleDeleteExercise}
              />
            ))}
          </div>
          <FabContainer>
            <IconButton color="primary" variant="solid" onClick={onOpen}>
              <PlusIcon size={16} />
            </IconButton>
          </FabContainer>
        </MainContainer>
      </PageContainer>
      <NewExerciseModal
        isOpen={isOpen}
        onClose={onClose}
        onAdd={handleAddExercise}
      />
    </>
  );
}
