"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function updateWorkoutExercises(
  workoutId: string,
  exerciseIds: string[]
) {
  const userId = await getUserId();
  return await db.workoutExercise.updateWorkoutExercises(
    userId,
    workoutId,
    exerciseIds
  );
}

export async function updateWorkoutSessionExercises(
  sessionId: string,
  exercisesIds: string[]
) {
  const userId = await getUserId();
  await db.workoutSessionExercise.updateSessionExercises(
    userId,
    sessionId,
    exercisesIds
  );
}
