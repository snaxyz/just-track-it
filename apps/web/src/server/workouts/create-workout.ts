"use server";

import { format } from "date-fns";
import { db } from "@local/database";
import { getUserId } from "../user";
import { nanoid } from "nanoid";
import { currentTimestamp } from "@/lib/timestamp";
import { redirect } from "next/navigation";

export async function createWorkoutAndRedirect() {
  const userId = await getUserId();
  const workoutId = createWorkoutId();

  await db.workoutHistory.create(userId, {
    workoutId,
    date: currentTimestamp(),
    exercises: [],
  });

  redirect(`/workouts/${workoutId}`);
}

function createWorkoutId() {
  const timestamp = format(new Date(), "yyyyMMddHH");
  return `${timestamp}-${nanoid()}`;
}
