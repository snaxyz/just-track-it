"use server";

import { db, exercise } from "@local/db";
import { getUserId } from "../user";
import { eq, and } from "drizzle-orm";

export async function deleteExercise(exerciseId: string) {
  const userId = await getUserId();
  await db
    .delete(exercise)
    .where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)));
}
