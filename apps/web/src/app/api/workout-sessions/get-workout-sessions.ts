import { QueryResponse, WorkoutHistoryModel } from "@local/database";

export async function getWorkoutSessions(): Promise<
  QueryResponse<WorkoutHistoryModel>
> {
  const response = await fetch("/api/workout-sessions");
  if (!response.ok) {
    throw new Error("Failed to fetch workout sessions");
  }

  return await response.json();
}
