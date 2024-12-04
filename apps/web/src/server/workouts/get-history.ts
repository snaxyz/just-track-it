"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getHistoryServer(historyId: string) {
  const userId = await getUserId();
  const workoutHistory = await db.workoutHistory.get(userId, historyId);
  const { records } = await db.workoutHistory.queryByWorkoutDate(
    userId,
    workoutHistory.workoutId
  );
  return {
    ...workoutHistory,
    isNew: records.length === 1,
  };
}
