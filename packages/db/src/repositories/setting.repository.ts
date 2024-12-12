import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { setting, SettingModel, SettingInsertModel } from "../schema";

export class SettingRepository extends BaseRepository {
  async findByUserId(userId: string) {
    return await this.db.query.setting.findFirst({
      where: eq(setting.userId, userId),
    });
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
