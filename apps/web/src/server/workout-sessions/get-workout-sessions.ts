"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

interface RequestOptions {
  limit?: number;
  cursor?: string;
}

export async function getWorkoutSessionsServer(options?: RequestOptions) {
  const userId = await getUserId();
  const workoutHistory = await db.workoutHistory.queryByDate(userId, {
    limit: options?.limit ?? 10,
    nextCursor: options?.cursor ?? "",
    order: "desc",
  });
  return workoutHistory;
}
