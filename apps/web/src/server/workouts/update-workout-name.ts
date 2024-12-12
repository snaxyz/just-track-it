"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import slugify from "slugify";

export async function updateWorkoutName(workoutId: string, newName: string) {
  const userId = await getUserId();
  await db.workout.update(userId, workoutId, {
    name: newName,
    slug: slugify(newName),
  });
}
