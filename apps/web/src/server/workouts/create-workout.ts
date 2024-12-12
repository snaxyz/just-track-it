"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import slugify from "slugify";

export async function createWorkout(
  name: string,
  description: string,
  exercises: { id: string; name: string; isDraft?: boolean }[]
) {
  const userId = await getUserId();

  const exercisesToAdd = await Promise.all(
    exercises.map((e) => {
      if (e.isDraft) {
        db.exercise.create({
          userId,
          name: e.name,
          slug: slugify(e.name),
          keywords: [],
        });
      }
      return e;
    })
  );

  return await db.workout.createWithExercises(
    {
      userId,
      name,
      slug: slugify(name),
      description,
    },
    exercisesToAdd.map((e) => e.id)
  );
}
