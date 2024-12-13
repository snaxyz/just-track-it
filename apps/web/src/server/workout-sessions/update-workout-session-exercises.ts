"use server";

import { db, WorkoutSessionExerciseModel } from "@local/db";
import { getUserId } from "../user";

export async function updateWorkoutSessionExercises(
  sessionId: string,
  exercises: Pick<WorkoutSessionExerciseModel, "exerciseId" | "sets">[]
) {
  const userId = await getUserId();
  await db.workoutSessionExercise.updateSessionExercises(
    userId,
    sessionId,
    exercises
  );
}
