"use server";

import { getUserId } from "@/server/user";
import { db, ExerciseModel, QueryOptions, QueryResponse } from "@local/db";

export async function getExercisesServer(
  options: QueryOptions = { limit: 20, order: "asc" }
): Promise<QueryResponse<ExerciseModel>> {
  const userId = await getUserId();

  return await db.exercise.query(userId, options);
}
