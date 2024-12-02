"use server";

import { format } from "date-fns";
import { db } from "@local/database";
import { getUserId } from "../user";
import { currentTimestamp } from "@/lib/timestamp";
import { redirect } from "next/navigation";

export async function createWorkoutAndRedirect() {
  const userId = await getUserId();
  const date = format(new Date(), "yyyy-MM-dd");
  const name = `New workout ${date}`;
  const { id } = await db.workout.create(userId, {
    name: `New workout ${date}`,
    exercises: [],
  });
  const { id: historyId } = await db.workoutHistory.create(userId, {
    workoutId: id,
    workoutName: name,
    date: currentTimestamp(),
    exercises: [],
  });

  redirect(`/workouts/${historyId}`);
}
