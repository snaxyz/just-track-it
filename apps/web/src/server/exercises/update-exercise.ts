"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function updateExercise(
  id: string,
  name: string,
  categories: string[]
) {
  const userId = await getUserId();
  return await db.exercise.update(userId, id, { name, categories });
}
