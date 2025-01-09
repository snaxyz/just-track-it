"use server";

import { db } from "@local/db";

export async function getUserSettings(userId: string) {
  const sidebarCollapsed = await db.setting.getSidebarCollapse(userId);
  return {
    sidebarCollapsed: Boolean(sidebarCollapsed?.value),
  };
}
