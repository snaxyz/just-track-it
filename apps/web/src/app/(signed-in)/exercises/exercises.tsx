"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { ExerciseModel, QueryResponse } from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import { NewExerciseModal, ExerciseCard, EmptyExercisesPlaceholder } from "@/components/exercises";
import { Button, Box, Fab, TextField, InputAdornment } from "@mui/material";
import { createExercise } from "@/server/exercises/create-exercise";
import { deleteExercise } from "@/server/exercises/delete-exercise";
import { updateExercise } from "@/server/exercises/update-exercise";
import { useState, useMemo } from "react";
import { ExercisesLoading } from "./exercises-loading";
import { TrackingOption } from "@/components/exercises/exercise-tracking-select";

export function Exercises() {
  const queryClient = useQueryClient();
  const { data: exercisesQuery, isLoading } = useQuery<QueryResponse<ExerciseModel>>({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = useMemo(() => {
    if (!exercisesQuery?.records) return [];
    if (!searchQuery.trim()) return exercisesQuery.records;

    const query = searchQuery.toLowerCase();
    return exercisesQuery.records.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query) ||
        exercise.targetAreas.some((area) => area.toLowerCase().includes(query)),
    );
  }, [exercisesQuery?.records, searchQuery]);

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [addError, setAddError] = useState("");
  const handleAddExercise = async (
    name: string,
    targetAreas: string[],
    tracking: TrackingOption[],
    description?: string,
  ) => {
    try {
      const newExercise = await createExercise(name, targetAreas, tracking, description);
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

  const handleUpdateExercise = async (
    exerciseId: string,
    name: string,
    targetAreas: string[],
    tracking: TrackingOption[],
    description?: string,
  ) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).map((e) =>
        e.id === exerciseId
          ? {
              ...e,
              name,
              description: description ?? "",
              targetAreas,
              trackSets: tracking.includes("sets"),
              trackReps: tracking.includes("reps"),
              trackWeight: tracking.includes("weight"),
              trackDuration: tracking.includes("duration"),
            }
          : e,
      ),
    });
    await updateExercise(exerciseId, name, targetAreas, tracking, description);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    queryClient.setQueryData<QueryResponse<ExerciseModel>>(["exercises"], {
      ...(exercisesQuery ?? { cursor: "" }),
      records: (exercisesQuery?.records ?? []).filter((e) => e.id !== exerciseId),
    });
    await deleteExercise(exerciseId);
  };

  if (isLoading) return <ExercisesLoading />;

  const noExercises = !exercisesQuery || exercisesQuery.records.length === 0;
  const noSearchResults = !noExercises && filteredExercises.length === 0;

  return (
    <>
      {noExercises && <EmptyExercisesPlaceholder onAddClick={onOpen} />}
      {!noExercises && (
        <Box sx={{ pb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} />
                </InputAdornment>
              ),
            }}
          />
          {noSearchResults ? (
            <Box sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>No exercises found</Box>
          ) : (
            filteredExercises.map((e) => (
              <ExerciseCard
                key={e.id}
                {...e}
                onUpdate={handleUpdateExercise}
                onDelete={handleDeleteExercise}
                sx={{ mb: 2 }}
              />
            ))
          )}
          <Box>
            <Button variant="contained" startIcon={<PlusIcon size={16} />} onClick={onOpen} color="primary" fullWidth>
              Create new exercise
            </Button>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "none", md: "block" },
        }}
      >
        <Fab color="primary" onClick={onOpen}>
          <PlusIcon size={24} />
        </Fab>
      </Box>
      <NewExerciseModal isOpen={isOpen} onClose={onClose} onAdd={handleAddExercise} error={addError} />
    </>
  );
}
