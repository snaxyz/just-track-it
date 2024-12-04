"use server";

import { getUserId } from "@/server/user";
import { db } from "@local/database";

export async function getExercisesServer() {
  const userId = await getUserId();
  return await db.exercise.queryByName(userId);
}
