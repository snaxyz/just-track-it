"use server";

import { db, WorkoutSessionModel, WorkoutModel } from "@local/database";
import { getUserId } from "../user";

export async function updateWorkoutExercises(
  workoutId: string,
  exercises: WorkoutModel["exercises"]
) {
  const userId = await getUserId();
  return await db.workout.update(userId, workoutId, {
    exercises,
  });
}

export async function updateWorkoutSessionExercises(
  historyId: string,
  exercises: WorkoutSessionModel["exercises"]
) {
  const userId = await getUserId();
  await db.workoutSession.update(userId, historyId, {
    exercises,
  });
}
