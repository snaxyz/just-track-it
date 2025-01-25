"use server";

import slugify from "slugify";
import { db } from "@local/db";
import { getUserId } from "../user";
import { TrackingOption } from "@/components/exercises/exercise-tracking-select";

export async function updateExercise(
  id: string,
  name: string,
  targetAreas: string[],
  tracking: TrackingOption[],
  description?: string,
) {
  const userId = await getUserId();
  return await db.exercise.update(userId, id, {
    name,
    slug: slugify(name),
    description,
    targetAreas,
    trackSets: tracking.includes("sets"),
    trackReps: tracking.includes("reps"),
    trackWeight: tracking.includes("weight"),
    trackDuration: tracking.includes("duration"),
  });
}
