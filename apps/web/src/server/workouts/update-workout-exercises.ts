"use server";

import { db, WorkoutModel } from "@local/database";
import { getUserId } from "../user";

export async function updateWorkoutExercises(
  workoutId: string,
  exercises: WorkoutModel["exercises"]
) {
  const userId = await getUserId();

  await db.workout.update(userId, workoutId, {
    exercises,
  });
}
