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

  const workoutExercises = await Promise.all(
    exercises.map((e) =>
      e.isDraft
        ? db.exercise.create({
            userId,
            name: e.name,
            slug: slugify(e.name),
            keywords: [],
            categories: [],
            description: "",
            hasSets: true,
            hasReps: true,
            hasWeight: true,
            hasDuration: false,
          })
        : e
    )
  );

  await db.workoutExercise.deleteByWorkoutId(userId, workoutId);
  await db.workoutExercise.createMany(
    userId,
    workoutId,
    workoutExercises.map((e) => e.id)
  );

  const updatedWorkout = await db.workout.update(userId, workoutId, {
    name,
    slug: slugify(name),
    description,
  });

  return updatedWorkout;
}
