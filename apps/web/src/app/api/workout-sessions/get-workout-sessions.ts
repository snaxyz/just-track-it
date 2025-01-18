import { QueryResponse, WorkoutSessionModel, WorkoutSessionWithRelations } from "@local/db";

interface RequestOptions {
  pageParam?: unknown;
}

export async function getWorkoutSessions(options: RequestOptions): Promise<QueryResponse<WorkoutSessionWithRelations>> {
  const response = await fetch(`/api/workout-sessions?limit=3&cursor=${options.pageParam ?? ""}`);
  if (!response.ok) {
    throw new Error("Failed to fetch workout sessions");
  }

  return await response.json();
}

export async function getWorkoutSessionHistory(
  options: RequestOptions,
): Promise<QueryResponse<WorkoutSessionWithRelations>> {
  const response = await fetch(`/api/workout-sessions?limit=10&cursor=${options.pageParam ?? ""}`);
  if (!response.ok) {
    throw new Error("Failed to fetch workout sessions");
  }

  return await response.json();
}
