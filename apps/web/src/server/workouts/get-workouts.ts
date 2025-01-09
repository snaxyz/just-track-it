"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function getWorkoutsServer() {
  const userId = await getUserId();
  return await db.workout.query(userId);
}
