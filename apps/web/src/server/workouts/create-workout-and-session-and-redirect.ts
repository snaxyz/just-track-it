"use server";

import { format } from "date-fns";
import { db } from "@local/db";
import { getUserId } from "../user";
import { redirect } from "next/navigation";
import slugify from "slugify";

export async function createWorkoutAndSessionAndRedirect() {
  const userId = await getUserId();
  const date = format(new Date(), "yyyy-MM-dd");
  const name = `New workout ${date}`;

  const workout = await db.workout.create({
    userId,
    name,
    slug: slugify(name),
    description: "",
  });

  const session = await db.workoutSession.create({
    userId,
    workoutId: workout.id,
  });

  redirect(`/sessions/${session.id}`);
}
