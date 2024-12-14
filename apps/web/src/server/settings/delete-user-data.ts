"use server";

import { db } from "@local/db";
import { getUserId } from "../user";
import { redirect } from "next/navigation";

export async function deleteUserData() {
  const userId = await getUserId();
  await db.deleteUserData(userId);
  redirect("/");
}
