import { QueryResponse, WorkoutModel, WorkoutWithRelations } from "@local/db";

export async function getWorkouts(): Promise<
  QueryResponse<WorkoutWithRelations>
> {
  const response = await fetch("/api/workouts");
  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
