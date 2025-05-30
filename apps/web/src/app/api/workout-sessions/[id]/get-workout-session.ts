import { EnhancedWorkoutSession } from "@/server/types";

export async function getWorkoutSession(
  sessionId: string
): Promise<EnhancedWorkoutSession> {
  const response = await fetch(`/api/workout-sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout session");
  }

  return await response.json();
}
