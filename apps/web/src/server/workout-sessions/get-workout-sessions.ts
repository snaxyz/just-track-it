"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

interface RequestOptions {
  limit?: number;
  cursor?: string;
}

export async function getWorkoutSessionsServer(options?: RequestOptions) {
  const userId = await getUserId();
  const workoutHistory = await db.workoutSession.query(userId, {
    limit: options?.limit ?? 10,
    nextCursor: options?.cursor ?? "",
    order: "desc",
  });
  return workoutHistory;
}
