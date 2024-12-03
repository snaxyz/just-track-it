import { QueryResponse, ExerciseModel } from "@local/database";

export async function getExercises(): Promise<QueryResponse<ExerciseModel>> {
  const response = await fetch("/api/exercises");
  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }

  return await response.json();
}
