"use client";

import { getWorkouts } from "@/app/api/workouts/get-workouts";
import { createWorkout } from "@/server/workouts";
import { ExerciseModel, QueryResponse, WorkoutWithRelations } from "@local/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import {
  CreateWorkoutModal,
  CreateWorkoutModalProps,
  EmptyWorkoutsPlaceholder,
  WorkoutCard,
  WorkoutCardExercises,
  WorkoutCardSkeleton,
} from "@/components/workouts";
import { useCallback, useState, useMemo } from "react";
import { startWorkoutSessionAndRedirect } from "@/server/workout-sessions/start-workout";
import { Box, Button, IconButton, Fab, TextField, InputAdornment } from "@mui/material";
import { getExercises } from "@/app/api/exercises/get-exercises";
import { EditWorkoutModal, EditWorkoutModalProps } from "@/components/workouts/edit-workout-modal";
import { updateWorkout } from "@/server/workouts";
import { WorkoutsLoading } from "./workouts-loading";

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

  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkouts = useMemo(() => {
    if (!workoutsQuery?.records) return [];
    if (!searchQuery.trim()) return workoutsQuery.records;

    const query = searchQuery.toLowerCase();
    return workoutsQuery.records.filter(
      (workout) =>
        workout.name.toLowerCase().includes(query) ||
        workout.description?.toLowerCase().includes(query) ||
        workout.exercises?.some((e) => e.exercise.name.toLowerCase().includes(query)),
    );
  }, [workoutsQuery?.records, searchQuery]);

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

  if (isLoading) return <WorkoutsLoading />;

  const noWorkouts = !workoutsQuery || workoutsQuery.records.length === 0;
  const noSearchResults = !noWorkouts && filteredWorkouts.length === 0;

  return (
    <>
      {noWorkouts && <EmptyWorkoutsPlaceholder onAddClick={onOpen} />}
      {!noWorkouts && (
        <Box sx={{ pb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search workouts..."
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
            <Box sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>No workouts found</Box>
          ) : (
            filteredWorkouts.map((w) => (
              <WorkoutCard
                key={w.id}
                id={w.id}
                name={w.name}
                description={w.description ?? undefined}
                onStartWorkout={handleStartWorkout}
                onEditClick={handleEditWorkout}
              >
                <WorkoutCardExercises exercises={w.exercises ?? []} />
              </WorkoutCard>
            ))
          )}
          {isCreating && <WorkoutCardSkeleton />}
          <Box>
            <Button variant="contained" startIcon={<PlusIcon size={16} />} onClick={onOpen} color="primary" fullWidth>
              Create new workout
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
    </>
  );
}
