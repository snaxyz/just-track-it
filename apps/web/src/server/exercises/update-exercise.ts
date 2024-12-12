"use server";

import slugify from "slugify";
import { db, exercise } from "@local/db";
import { getUserId } from "../user";
import { eq, and } from "drizzle-orm";

export async function updateExercise(
  id: string,
  name: string,
  categories: string[]
) {
  const userId = await getUserId();
  return await db
    .update(exercise)
    .set({
      name,
      slug: slugify(name),
      keywords: categories,
      updatedAt: new Date(),
    })
    .where(and(eq(exercise.id, id), eq(exercise.userId, userId)));
}
