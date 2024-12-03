"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function createExercise(name: string) {
  const userId = await getUserId();
  return await db.exercise.create(userId, { name, keywords: [] });
}
