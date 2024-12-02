import { QueryResponse, WorkoutModel } from "@local/database";

export async function getWorkouts(): Promise<QueryResponse<WorkoutModel>> {
  const response = await fetch("/api/workouts");
  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
