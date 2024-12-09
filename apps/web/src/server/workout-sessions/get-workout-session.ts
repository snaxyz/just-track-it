"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutSessionServer(sessionId: string) {
  const userId = await getUserId();
  const workoutSession = await db.workoutSession.get(userId, sessionId);
  const { records } = await db.workoutSession.queryByWorkoutSessionDate(
    userId,
    workoutSession.workoutId
  );
  const lastSession = records[0];
  return {
    ...workoutSession,
    isNew: records.length === 1,
    lastSession,
  };
}
