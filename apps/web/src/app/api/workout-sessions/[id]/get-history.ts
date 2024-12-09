import { WorkoutSessionModel } from "@local/database";

export interface EnhancedWorkoutSessionModel extends WorkoutSessionModel {
  /**
   * Used to determine if workout is a new one, then all exercises, name changes,
   * etc update the related workout
   */
  isNew: boolean;
  /**
   * Used to set the reps and weight to last on done
   */
  lastSession?: WorkoutSessionModel;
}

export async function getWorkoutSession(
  sessionId: string
): Promise<EnhancedWorkoutSessionModel> {
  const response = await fetch(`/api/workout-sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout session");
  }

  return await response.json();
}
