"use server";

import { getUserId } from "@/server/user";
import { db, exercise, ExerciseModel } from "@local/db";
import { and, eq, gt } from "drizzle-orm";

interface GetExercisesOptions {
  cursor?: {
    name: string;
  };
  limit?: number;
}

type QueryResponse<T> = {
  cursor: string;
  records: T[];
};

export async function getExercisesServer(
  options: GetExercisesOptions = {}
): Promise<QueryResponse<ExerciseModel>> {
  const userId = await getUserId();
  const limit = options.limit ?? 20;

  const exercises = await db.query.exercise.findMany({
    where: and(
      eq(exercise.userId, userId),
      options.cursor ? gt(exercise.name, options.cursor.name) : undefined
    ),
    orderBy: exercise.name,
    limit: limit + 1, // fetch one extra to determine if there are more results
  });

  const hasMore = exercises.length > limit;
  const records = hasMore ? exercises.slice(0, -1) : exercises;
  const lastRecord = records[records.length - 1];

  return {
    records,
    cursor: hasMore ? JSON.stringify({ name: lastRecord.name }) : "",
  };
}
