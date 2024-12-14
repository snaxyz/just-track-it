"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import { revalidatePath } from "next/cache";

export async function initSampleData() {
  const userId = await getUserId();
  // Start transaction to ensure all-or-nothing initialization
  await db.drizzleClient.transaction(async (tx) => {
    // Insert sample workouts (which also creates exercises)
    await db.insertSampleWorkouts(userId);

    // Mark initialization as complete
    await db.setting.update(userId, "initialSetupCompleted", "true");
  });

  // Revalidate all pages to show new data
  revalidatePath("/");
}
