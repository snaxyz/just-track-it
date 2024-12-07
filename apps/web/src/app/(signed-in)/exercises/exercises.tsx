"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { ExerciseModel, QueryResponse } from "@local/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@/components/icon-button";
import { PlusIcon } from "lucide-react";
import { FabContainer } from "@/components/layout/fab-container";
import {
  NewExerciseModal,
  ExerciseCard,
  EmptyExercisesPlaceholder,
} from "@/components/exercises";
import { useDisclosure } from "@nextui-org/react";
import { createExercise } from "@/server/exercises/create-exercise";
import { deleteExercise } from "@/server/exercises/delete-exercise";
import { updateExercise } from "@/server/exercises/update-exercise";
import { useState } from "react";
import { Title } from "@/components/title";

export function Exercises() {
  const queryClient = useQueryClient();
  const { data: exercisesQuery, isLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addError, setAddError] = useState("");
  const handleAddExercise = async (name: string, categories: string[]) => {
    try {
      const newExercise = await createExercise(name, categories);
      queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
        ...(exercisesQuery ?? { cursor: "" }),
        records: [...(exercisesQuery?.records ?? []), newExercise],
      });
      setAddError("");
      onClose();
    } catch (e) {
      if ((e as Error).message === "DUPLICATE_NAME_ERROR") {
        setAddError(`"${name}" already exists.`);
      } else {
        setAddError((e as Error).message);
      }
    }
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
      <Title>Exercises</Title>
      {noExercises && <EmptyExercisesPlaceholder onAddClick={onOpen} />}
      <div className="pb-24">
        {exercisesQuery?.records.map((e) => (
          <ExerciseCard
            key={e.id}
            className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3"
            {...e}
            onUpdate={handleUpdateExercise}
            onDelete={handleDeleteExercise}
          />
        ))}
      </div>
      <FabContainer>
        <IconButton color="primary" variant="solid" onPress={onOpen}>
          <PlusIcon size={16} />
        </IconButton>
      </FabContainer>
      <NewExerciseModal
        isOpen={isOpen}
        onClose={onClose}
        onAdd={handleAddExercise}
        error={addError}
      />
    </>
  );
}
