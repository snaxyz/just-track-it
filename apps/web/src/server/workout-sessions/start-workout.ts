"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import { redirect } from "next/navigation";

export async function startWorkoutSessionAndRedirect(workoutId: string) {
  const userId = await getUserId();
  const exercises = await db.workoutExercise.getByWorkoutId(userId, workoutId);
  const { id: sessionId } = await db.workoutSession.create({
    userId,
    workoutId,
  });

  await db.workoutSessionExercise.updateSessionExercises(
    userId,
    sessionId,
    exercises
  );

  redirect(`/sessions/${sessionId}`);
}
