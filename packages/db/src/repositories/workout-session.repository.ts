import { and, eq, gt, desc } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import {
  workoutSession,
  WorkoutSessionModel,
  WorkoutSessionInsertModel,
} from "../schema";
import {
  QueryResponse,
  keyToCursor,
  cursorToKey,
  QueryOptions,
} from "../types";

export class WorkoutSessionRepository extends BaseRepository {
  async create(
    data: Omit<
      WorkoutSessionInsertModel,
      "id" | "startedAt" | "createdAt" | "updatedAt"
    >
  ) {
    const [result] = await this.db
      .insert(workoutSession)
      .values({
        ...data,
        startedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
      and(
        eq(workoutSession.userId, userId),
        eq(workoutSession.workoutId, workoutId)
      )
    );
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ): Promise<QueryResponse<WorkoutSessionModel>> {
    const cursorData = options.nextCursor
      ? cursorToKey<{ createdAt: Date }>(options.nextCursor)
      : undefined;

    const sessions = await this.db.query.workoutSession.findMany({
      where: and(
        eq(workoutSession.userId, userId),
        cursorData
          ? gt(workoutSession.createdAt, cursorData.createdAt)
          : undefined
      ),
      with: {
        workout: true,
        exercises: true,
      },
      orderBy:
        options.order === "asc"
          ? workoutSession.createdAt
          : desc(workoutSession.createdAt),
      limit: options.limit + 1,
    });

    const hasMore = sessions.length > options.limit;
    const records = hasMore ? sessions.slice(0, -1) : sessions;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : "",
    };
  }

  async queryByWorkoutId(
    userId: string,
    workoutId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ) {
    const cursorData = options.nextCursor
      ? cursorToKey<{ createdAt: Date }>(options.nextCursor)
      : undefined;

    const sessions = await this.db.query.workoutSession.findMany({
      where: and(
        eq(workoutSession.userId, userId),
        eq(workoutSession.workoutId, workoutId),
        cursorData
          ? gt(workoutSession.createdAt, cursorData.createdAt)
          : undefined
      ),
      orderBy:
        options.order === "asc"
          ? workoutSession.createdAt
          : desc(workoutSession.createdAt),
      limit: options.limit + 1,
      with: {
        workout: true,
        exercises: true,
      },
    });

    const hasMore = sessions.length > options.limit;
    const records = hasMore ? sessions.slice(0, -1) : sessions;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ createdAt: lastRecord.createdAt }) : "",
    };
  }

  async update(
    userId: string,
    id: string,
    data: Partial<WorkoutSessionInsertModel>
  ) {
    const [result] = await this.db
      .update(workoutSession)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(workoutSession.id, id), eq(workoutSession.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string) {
    await this.db
      .delete(workoutSession)
      .where(and(eq(workoutSession.id, id), eq(workoutSession.userId, userId)));
  }
}
