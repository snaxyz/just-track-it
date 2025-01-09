"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { ExerciseModel, QueryResponse } from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@/components/icon-button";
import { MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { FabContainer } from "@/components/layout/fab-container";
import {
  NewExerciseModal,
  ExerciseCard,
  EmptyExercisesPlaceholder,
} from "@/components/exercises";
import { Button, useDisclosure } from "@nextui-org/react";
import { createExercise } from "@/server/exercises/create-exercise";
import { deleteExercise } from "@/server/exercises/delete-exercise";
import { updateExercise } from "@/server/exercises/update-exercise";
import { useState } from "react";
import { Title } from "@/components/title";
import { ExercisesLoading } from "./exercises-loading";

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
      if (
        (e as Error).message.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
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

  const handleAskAI = () => {};

  if (isLoading) return <ExercisesLoading />;

  const noExercises = !exercisesQuery || exercisesQuery.records.length === 0;

  return (
    <>
      <div className="px-1">
        <Title>Exercises</Title>
      </div>
      {noExercises && (
        <EmptyExercisesPlaceholder
          onAddClick={onOpen}
          onAskAIClick={handleAskAI}
        />
      )}
      <div className="pb-24">
        {exercisesQuery?.records.map((e) => (
          <ExerciseCard
            key={e.id}
            {...e}
            onUpdate={handleUpdateExercise}
            onDelete={handleDeleteExercise}
          />
        ))}
        {!noExercises && (
          <div className="p-2">
            <Button
              variant="solid"
              startContent={<PlusIcon size={16} />}
              onPress={onOpen}
              radius="lg"
              color="primary"
              fullWidth
            >
              Create new exercise
            </Button>
          </div>
        )}
      </div>
      <FabContainer>
        <IconButton color="primary" variant="solid" onPress={onOpen}>
          <MessageSquarePlusIcon size={16} />
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
