import { WorkoutHistoryModel } from "@local/database";

export interface EnhancedWorkoutHistoryModel extends WorkoutHistoryModel {
  /**
   * Used to determine if workout is a new one, then all exercises, name changes,
   * etc update the related workout
   */
  isNew: boolean;
}

export async function getWorkoutHistory(
  historyId: string
): Promise<EnhancedWorkoutHistoryModel> {
  const response = await fetch(`/api/history/${historyId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout history");
  }

  return await response.json();
}
