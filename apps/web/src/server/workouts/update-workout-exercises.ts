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
