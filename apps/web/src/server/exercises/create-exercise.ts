"use server";

import slugify from "slugify";
import { db } from "@local/db";
import { getUserId } from "../user";

export async function createExercise(name: string, categories: string[]) {
  const userId = await getUserId();
  return await db.exercise.create({
    userId,
    name,
    slug: slugify(name),
    categories,
    description: null,
    keywords: [],
    hasSets: true,
    hasReps: true,
    hasWeight: true,
    hasDuration: false,
  });
}
