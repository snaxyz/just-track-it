import { QueryResponse, WorkoutSessionModel } from "@local/database";

interface RequestOptions {
  pageParam?: unknown;
}

export async function getWorkoutSessions(
  options: RequestOptions
): Promise<QueryResponse<WorkoutSessionModel>> {
  const response = await fetch(
    `/api/workout-sessions?limit=10&cursor=${options.pageParam ?? ""}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch workout sessions");
  }

  return await response.json();
}
