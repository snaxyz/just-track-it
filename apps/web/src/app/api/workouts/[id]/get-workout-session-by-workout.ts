import { WorkoutSessionWithRelations } from "@local/db";

export async function getWorkoutSessionByWorkout(
  workoutId: string
): Promise<WorkoutSessionWithRelations> {
  const response = await fetch(`/api/workouts/${workoutId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
