import { QueryResponse, WorkoutSessionWithRelations } from "@local/db";

export async function getWorkoutHistory(
  workoutId: string
): Promise<
  QueryResponse<WorkoutSessionWithRelations> & { workoutName: string }
> {
  const response = await fetch(`/api/workouts/${workoutId}/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
