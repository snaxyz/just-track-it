"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutSessionServer(historyId: string) {
  const userId = await getUserId();
  const workoutSession = await db.workoutSession.get(userId, historyId);
  const { records } = await db.workoutSession.queryByWorkoutSessionDate(
    userId,
    workoutSession.workoutId
  );
  return {
    ...workoutSession,
    isNew: records.length === 1,
  };
}
