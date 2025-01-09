"use server";

import slugify from "slugify";
import { db } from "@local/db";
import { getUserId } from "../user";

export async function updateExercise(
  id: string,
  name: string,
  categories: string[]
) {
  const userId = await getUserId();
  return await db.exercise.update(userId, id, {
    name,
    slug: slugify(name),
    categories,
  });
}
