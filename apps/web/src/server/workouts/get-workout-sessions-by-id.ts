"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function getWorkoutSessionsByIdServer(workoutId: string) {
  const userId = await getUserId();
  const workout = await db.workout.get(userId, workoutId);
  const sessions = await db.workoutSession.queryByWorkoutId(userId, workoutId, {
    limit: 100,
    order: "desc",
  });

  return {
    ...sessions,
    workoutName: workout.name,
  };
}
