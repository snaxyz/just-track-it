import { and, eq, gt, desc } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { workoutSession, WorkoutSessionModel, WorkoutSessionInsertModel } from "../schema";
import { QueryResponse, keyToCursor, cursorToKey, QueryOptions } from "../types";

export class WorkoutSessionRepository extends BaseRepository {
  async create(data: Omit<WorkoutSessionInsertModel, "id" | "startedAt" | "createdAt" | "updatedAt" | "completedAt">) {
    const timestamp = new Date().toISOString();
    const [result] = await this.db
      .insert(workoutSession)
      .values({
        ...data,
        startedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        completedAt: timestamp,
      })
      .returning();
    return result;
  }

  async get(userId: string, id: string) {
    return await this.db.query.workoutSession.findFirst({
      where: and(eq(workoutSession.id, id), eq(workoutSession.userId, userId)),
      with: {
        workout: true,
        exercises: {
          with: {
            exercise: true,
          },
        },
      },
    });
  }

  async count(userId: string, workoutId: string) {
    return await this.db.$count(
      workoutSession,
      and(eq(workoutSession.userId, userId), eq(workoutSession.workoutId, workoutId)),
    );
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" },
  ): Promise<QueryResponse<WorkoutSessionModel>> {
    const cursorData = options.nextCursor ? cursorToKey<{ createdAt: string }>(options.nextCursor) : undefined;

    const sessions = await this.db.query.workoutSession.findMany({
      where: and(
        eq(workoutSession.userId, userId),
        cursorData ? gt(workoutSession.createdAt, cursorData.createdAt) : undefined,
      ),
      with: {
        workout: true,
        exercises: {
          with: {
            exercise: true,
          },
        },
      },
      orderBy: options.order === "asc" ? workoutSession.createdAt : desc(workoutSession.createdAt),
      limit: options.limit + 1,
    });

    const hasMore = sessions.length > options.limit;
    const records = hasMore ? sessions.slice(0, -1) : sessions;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : null,
    };
  }

  async queryByWorkoutId(userId: string, workoutId: string, options: QueryOptions = { limit: 20, order: "asc" }) {
    const cursorData = options.nextCursor ? cursorToKey<{ createdAt: string }>(options.nextCursor) : undefined;

    const sessions = await this.db.query.workoutSession.findMany({
      where: and(
        eq(workoutSession.userId, userId),
        eq(workoutSession.workoutId, workoutId),
        cursorData ? gt(workoutSession.createdAt, cursorData.createdAt) : undefined,
      ),
      orderBy: options.order === "asc" ? workoutSession.createdAt : desc(workoutSession.createdAt),
      limit: options.limit + 1,
      with: {
        workout: true,
        exercises: {
          with: {
            exercise: true,
          },
        },
      },
    });

    const hasMore = sessions.length > options.limit;
    const records = hasMore ? sessions.slice(0, -1) : sessions;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : null,
    };
  }

  async update(userId: string, id: string, data: Partial<WorkoutSessionInsertModel>) {
    const [result] = await this.db
      .update(workoutSession)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(workoutSession.id, id), eq(workoutSession.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string) {
    await this.db.delete(workoutSession).where(and(eq(workoutSession.id, id), eq(workoutSession.userId, userId)));
  }
}
