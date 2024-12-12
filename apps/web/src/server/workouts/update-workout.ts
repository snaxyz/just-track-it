"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import slugify from "slugify";

export async function updateWorkout(
  workoutId: string,
  name: string,
  description: string,
  exercises: { id: string; name: string; isDraft?: boolean }[]
) {
  const userId = await getUserId();

  const draftExercises = await Promise.all(
    exercises
      .filter((e) => e.isDraft)
      .map((e) =>
        db.exercise.create({
          userId,
          name: e.name,
          slug: slugify(e.name),
          keywords: [],
        })
      )
  );

  const existingExercises = exercises.filter((e) => !e.isDraft);
  const allExercises = [...existingExercises, ...draftExercises];

  return await db.workout.update(userId, workoutId, {
    name,
    slug: slugify(name),
    description,
  });
}
