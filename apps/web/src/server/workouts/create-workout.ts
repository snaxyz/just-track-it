"use server";

import { db, ExerciseModel } from "@local/database";
import { getUserId } from "../user";

export async function createWorkout(
  name: string,
  description: string,
  exercises: (Pick<ExerciseModel, "id" | "name"> & { isDraft?: boolean })[]
) {
  const userId = await getUserId();
  const draftExercises = exercises.filter((e) => e.isDraft);
  const existingExercises = exercises.filter((e) => !e.isDraft);
  const createdExercises = await Promise.all(
    draftExercises.map(async (e) => {
      return await db.exercise.create(userId, { name: e.name, categories: [] });
    })
  );
  return await db.workout.create(userId, {
    name,
    description,
    exercises: existingExercises.concat(createdExercises).map((e) => ({
      exerciseId: e.id,
      exerciseName: e.name,
    })),
  });
}
