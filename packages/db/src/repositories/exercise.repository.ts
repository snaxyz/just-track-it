import { and, eq, gt, desc } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { exercise, ExerciseModel, ExerciseInsertModel } from "../schema";
import {
  QueryResponse,
  keyToCursor,
  cursorToKey,
  QueryOptions,
} from "../types";

export class ExerciseRepository extends BaseRepository {
  async create(data: Omit<ExerciseModel, "id" | "createdAt" | "updatedAt">) {
    const [result] = await this.db
      .insert(exercise)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result;
  }

  async get(userId: string, id: string) {
    return await this.db.query.exercise.findFirst({
      where: and(eq(exercise.id, id), eq(exercise.userId, userId)),
    });
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ): Promise<QueryResponse<ExerciseModel>> {
    const cursorData = options.nextCursor
      ? cursorToKey<{ name: string }>(options.nextCursor)
      : undefined;

    const exercises = await this.db.query.exercise.findMany({
      where: and(
        eq(exercise.userId, userId),
        cursorData ? gt(exercise.name, cursorData.name) : undefined
      ),
      orderBy: options.order === "asc" ? exercise.name : desc(exercise.name),
      limit: options.limit + 1,
    });

    const hasMore = exercises.length > options.limit;
    const records = hasMore ? exercises.slice(0, -1) : exercises;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ name: lastRecord.name }) : "",
    };
  }

  async update(userId: string, id: string, data: Partial<ExerciseInsertModel>) {
    const [result] = await this.db
      .update(exercise)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(exercise.id, id), eq(exercise.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string) {
    await this.db
      .delete(exercise)
      .where(and(eq(exercise.id, id), eq(exercise.userId, userId)));
  }
}
