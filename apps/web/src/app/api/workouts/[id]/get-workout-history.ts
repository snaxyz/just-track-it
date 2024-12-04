import { EnhancedWorkoutHistory } from "./route";

export async function getWorkoutHistory(
  workoutId: string
): Promise<EnhancedWorkoutHistory> {
  const response = await fetch(`/api/workouts/${workoutId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
