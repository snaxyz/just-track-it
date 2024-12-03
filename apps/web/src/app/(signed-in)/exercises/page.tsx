"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { ExerciseModel, QueryResponse } from "@local/database";
import { useQuery } from "@tanstack/react-query";
import { EmptyExercisesPlaceholder } from "./components/empty-workouts-placeholder";
import { Grow } from "@/components/layout/grow";
import { IconButton } from "@/components/icon-button";
import { DeleteIcon, PencilIcon, TrashIcon } from "lucide-react";

export default function ExercisesPage() {
  const { data: exercisesQuery, isLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  if (isLoading) return <div>...loading...</div>;

  const noExercises = !exercisesQuery || exercisesQuery.records.length === 0;

  return (
    <PageContainer>
      <MainContainer className="px-2">
        <div className="text-xl mb-3">Exercises</div>
        {noExercises && <EmptyExercisesPlaceholder onAddClick={() => {}} />}
        <div className="pb-24">
          {exercisesQuery?.records.map((e) => (
            <div
              key={e.id}
              className="capitalize p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3 flex items-center gap-1"
            >
              <span>{e.name}</span>
              <Grow />
              <IconButton>
                <PencilIcon size={16} />
              </IconButton>
              <IconButton>
                <TrashIcon size={16} />
              </IconButton>
            </div>
          ))}
        </div>
      </MainContainer>
    </PageContainer>
  );
}
