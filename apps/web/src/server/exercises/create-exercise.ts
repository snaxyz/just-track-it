"use server";

import slugify from "slugify";
import { db, exercise } from "@local/db";
import { getUserId } from "../user";

export async function createExercise(name: string, categories: string[]) {
  const userId = await getUserId();
  return await db.insert(exercise).values({
    userId,
    name,
    slug: slugify(name),
    keywords: categories,
  });
}
