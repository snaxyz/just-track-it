"use server";

import { db } from "@local/db";
import { getUserId } from "../user";

export async function deleteUserData() {
  const userId = await getUserId();
  await db.deleteUserData(userId);
}
