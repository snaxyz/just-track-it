"use client";

import { getExercises } from "@/app/api/exercises/get-exercises";
import { ExerciseModel, QueryResponse } from "@local/database";
import { useQuery } from "@tanstack/react-query";

interface Props {
  id: string;
}

export function Workout({ id }: Props) {
  const { data: exercisesQuery, isLoading } = useQuery<
    QueryResponse<ExerciseModel>
  >({
    queryKey: ["exercises"],
    queryFn: () => getExercises(),
  });

  return <div>workout</div>;
}
