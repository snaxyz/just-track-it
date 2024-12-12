"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import { redirect } from "next/navigation";

export async function startWorkoutSessionAndRedirect(workoutId: string) {
  const userId = await getUserId();
  const { id: sessionId } = await db.workoutSession.create({
    userId,
    workoutId,
  });

  redirect(`/sessions/${sessionId}`);
}
