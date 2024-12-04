"use server";

import { db } from "@local/database";
import { getUserId } from "../user";

export async function getWorkoutsServer() {
  const userId = await getUserId();
  return await db.workout.queryByDate(userId);
}
