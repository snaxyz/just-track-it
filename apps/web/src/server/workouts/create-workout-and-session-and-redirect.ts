"use server";

import { format } from "date-fns";
import { db } from "@local/database";
import { getUserId } from "../user";
import { currentTimestamp } from "@/lib/timestamp";
import { redirect } from "next/navigation";

export async function createWorkoutAndSessionAndRedirect() {
  const userId = await getUserId();
  const date = format(new Date(), "yyyy-MM-dd");
  const name = `New workout ${date}`;
  const { id } = await db.workout.create(userId, {
    name: `New workout ${date}`,
    description: "",
    exercises: [],
  });
  const { id: sessionId } = await db.workoutSession.create(userId, {
    workoutId: id,
    workoutName: name,
    date: currentTimestamp(),
    exercises: [],
  });

  redirect(`/sessions/${sessionId}`);
}
