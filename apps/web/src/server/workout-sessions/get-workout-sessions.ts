"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutSessionsServer() {
  const userId = await getUserId();
  const workoutHistory = await db.workoutHistory.queryByDate(userId, {
    limit: 3,
    order: "desc",
  });
  return workoutHistory;
}
