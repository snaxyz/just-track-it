import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { setting } from "../schema";

export class SettingRepository extends BaseRepository {
  async get(userId: string) {
    return await this.db.query.setting.findFirst({
      where: eq(setting.userId, userId),
    });
  }

  async getSidebarCollapse(userId: string) {
    return await this.db.query.setting.findFirst({
      where: and(
        eq(setting.userId, userId),
        eq(setting.key, "sidebarCollapsed")
      ),
    });
  }

  async updateSidebarCollapse(userId: string, collapsed: boolean) {
    return await this.db
      .update(setting)
      .set({
        key: "sidebarCollapsed",
        value: collapsed.toString(),
      })
      .where(eq(setting.userId, userId));
  }

  // async upsert(userId: string, data: Partial<SettingInsertModel>) {
  //   const [result] = await this.db
  //     .insert(setting)
  //     .values({
  //       userId,
  //       ...data,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     })
  //     .onConflictDoUpdate({
  //       target: setting.userId,
  //       set: {
  //         ...data,
  //         updatedAt: new Date(),
  //       },
  //     })
  //     .returning();
  //   return result;
  // }
}
