"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutHistoryServer(workoutId: string) {
  const userId = await getUserId();
  const workout = await db.workout.get(userId, workoutId);
  const workoutSession = await db.workoutSession.queryByWorkoutSessionDate(
    userId,
    workoutId,
    {
      limit: 100,
      order: "desc",
    }
  );
  return {
    ...workoutSession,
    workoutName: workout.name,
  };
}
