"use server";

import { db, QueryResponse, WorkoutSessionWithRelations } from "@local/db";
import { getUserId } from "../user";

export async function getWorkoutSessionServer(sessionId: string) {
  const userId = await getUserId();
  const workoutSession = await db.workoutSession.get(userId, sessionId);
  const { records } = await db.workoutSession.queryByWorkoutId(
    userId,
    workoutSession.workoutId,
    {
      limit: 2,
      order: "desc",
    }
  );
  const lastSession = records[0];
  return {
    ...workoutSession,
    isNew: records.length === 1,
    lastSession,
  };
}
