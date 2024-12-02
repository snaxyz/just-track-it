"use server";

import { db } from "@local/database";

export async function getUserSettings(userId: string) {
  const settings = await db.setting.get(userId);
  return {
    sidebarCollapsed: Boolean(settings?.sidebarCollapsed),
  };
}
