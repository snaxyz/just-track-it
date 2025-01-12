"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { ExerciseModel, QueryResponse } from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { NewExerciseModal, ExerciseCard, EmptyExercisesPlaceholder } from "@/components/exercises";
import { Button, Box } from "@mui/material";
import { createExercise } from "@/server/exercises/create-exercise";
import { deleteExercise } from "@/server/exercises/delete-exercise";
import { updateExercise } from "@/server/exercises/update-exercise";
import { useState } from "react";
import { ExercisesLoading } from "./exercises-loading";

export function Exercises() {
  const queryClient = useQueryClient();
  const { data: exercisesQuery, isLoading } = useQuery<QueryResponse<ExerciseModel>>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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
      if ((e as Error).message.includes("duplicate key value violates unique constraint")) {
        setAddError(`"${name}" already exists.`);
      } else {
        setAddError((e as Error).message);
      }
    }
  };

  const handleUpdateExercise = async (exerciseId: string, name: string, categories: string[]) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              name,
              categories,
            }
          : e,
      ),
    });
    await updateExercise(exerciseId, name, categories);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).filter((e) => e.id !== exerciseId),
    });
    await deleteExercise(exerciseId);
  };

  const handleAskAI = () => {};

  if (isLoading) return <ExercisesLoading />;

  const noExercises = !exercisesQuery || exercisesQuery.records.length === 0;

  return (
    <>
      {noExercises && <EmptyExercisesPlaceholder onAddClick={onOpen} />}
      <Box sx={{ pb: 3 }}>
        {exercisesQuery?.records.map((e) => (
          <ExerciseCard key={e.id} {...e} onUpdate={handleUpdateExercise} onDelete={handleDeleteExercise} />
        ))}
        {!noExercises && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<PlusIcon size={16} />} onClick={onOpen} color="primary" fullWidth>
              Create new exercise
            </Button>
          </Box>
        )}
      </Box>
      <NewExerciseModal isOpen={isOpen} onClose={onClose} onAdd={handleAddExercise} error={addError} />
    </>
  );
}
