"use server";

import { db, WorkoutHistoryModel, WorkoutModel } from "@local/database";
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

export async function updateWorkoutHistoryExercises(
  historyId: string,
  exercises: WorkoutHistoryModel["exercises"]
) {
  const userId = await getUserId();
  await db.workoutHistory.update(userId, historyId, {
    exercises,
  });
}
