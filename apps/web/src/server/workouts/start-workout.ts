"use server";

import { db } from "@local/database";
import { getUserId } from "../user";
import { currentTimestamp } from "@/lib/timestamp";
import { redirect } from "next/navigation";

export async function startWorkoutAndRedirect(workoutId: string) {
  const userId = await getUserId();
  const workout = await db.workout.get(userId, workoutId);
  if (!workout) {
    // TODO do something
    throw new Error("Could not find workout");
  }
  const { id: historyId } = await db.workoutHistory.create(userId, {
    workoutId,
    workoutName: workout.name,
    date: currentTimestamp(),
    exercises: workout.exercises.map((e) => ({
      ...e,
      sets: [],
    })),
  });

  redirect(`/workouts/${historyId}`);
}
