"use server";

import { db, exercise } from "@local/db";
import { getUserId } from "../user";
import { eq, and } from "drizzle-orm";

export async function deleteExercise(exerciseId: string) {
  const userId = await getUserId();
  await db.exercise.delete(userId, exerciseId);
}
