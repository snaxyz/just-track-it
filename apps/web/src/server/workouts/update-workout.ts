"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import slugify from "slugify";

interface ExerciseDraft {
  id: string;
  name: string;
  isDraft?: boolean;
  targetAreas?: string[];
  trackSets?: boolean;
  trackReps?: boolean;
  trackWeight?: boolean;
  trackDuration?: boolean;
}

export async function updateWorkout(workoutId: string, name: string, description: string, exercises: ExerciseDraft[]) {
  const userId = await getUserId();

  const workoutExercises = await Promise.all(
    exercises.map((e) =>
      e.isDraft
        ? db.exercise.create({
            userId,
            name: e.name,
            slug: slugify(e.name),
            keywords: [],
            targetAreas: e.targetAreas ?? [],
            description: "",
            trackSets: Boolean(e.trackSets),
            trackReps: Boolean(e.trackReps),
            trackWeight: Boolean(e.trackWeight),
            trackDuration: Boolean(e.trackDuration),
          })
        : e,
    ),
  );

  await db.workoutExercise.deleteByWorkoutId(userId, workoutId);
  await db.workoutExercise.createMany(
    userId,
    workoutId,
    workoutExercises.map((e) => e.id),
  );

  const updatedWorkout = await db.workout.update(userId, workoutId, {
    name,
    slug: slugify(name),
    description,
  });

  return updatedWorkout;
}
