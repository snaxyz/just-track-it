"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function updateWorkoutName(workoutId: string, newName: string) {
  const userId = await getUserId();
  await db.workout.update(userId, workoutId, {
    name: newName,
  });
}
