"use server";

import slugify from "slugify";
import { db } from "@local/db";
import { getUserId } from "../user";
import { TrackingOption } from "@/components/exercises/exercise-tracking-select";

export async function createExercise(
  name: string,
  targetAreas: string[],
  tracking: TrackingOption[],
  description?: string,
) {
  const userId = await getUserId();

  return await db.exercise.create({
    userId,
    name,
    slug: slugify(name),
    targetAreas,
    description: description ?? "",
    keywords: [],
    trackSets: true,
    trackReps: tracking.includes("reps"),
    trackWeight: tracking.includes("weight"),
    trackDuration: tracking.includes("duration"),
  });
}
