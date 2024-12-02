"use server";

import { db } from "@local/database";

export async function updateUserSettingSidebarCollapsed(
  userId: string,
  collapsed: boolean
) {
  return await db.setting.updateSidebarCollapse(userId, collapsed);
}
