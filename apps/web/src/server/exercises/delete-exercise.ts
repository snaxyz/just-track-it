"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function deleteExercise(exerciseId: string) {
  const userId = await getUserId();
  await db.exercise.delete(userId, exerciseId);
}
