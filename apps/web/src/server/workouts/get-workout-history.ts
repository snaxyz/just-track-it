"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutHistoryServer(workoutId: string) {
  const userId = await getUserId();
  const workout = await db.workout.get(userId, workoutId);
  const workoutHistory = await db.workoutHistory.queryByWorkoutDate(
    userId,
    workoutId,
    {
      limit: 100,
      order: "desc",
    }
  );
  return {
    ...workoutHistory,
    workoutName: workout.name,
  };
}
