import { WorkoutSessionModel } from "@local/database";

export interface EnhancedWorkoutSessionModel extends WorkoutSessionModel {
  /**
   * Used to determine if workout is a new one, then all exercises, name changes,
   * etc update the related workout
   */
  isNew: boolean;
}

export async function getHistory(
  historyId: string
): Promise<EnhancedWorkoutSessionModel> {
  const response = await fetch(`/api/history/${historyId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return await response.json();
}
