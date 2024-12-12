import { and, eq, gt, desc } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import {
  workout,
  WorkoutModel,
  WorkoutInsertModel,
  workoutExercise,
} from "../schema";
import {
  QueryResponse,
  keyToCursor,
  cursorToKey,
  QueryOptions,
} from "../types";

export class WorkoutRepository extends BaseRepository {
  async create(
    data: Omit<WorkoutInsertModel, "id" | "createdAt" | "updatedAt">
  ) {
    const [result] = await this.db
      .insert(workout)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result;
  }

  async createWithExercises(
    data: Omit<WorkoutInsertModel, "id" | "createdAt" | "updatedAt">,
    exerciseIds: string[]
  ) {
    const [createdWorkout] = await this.db
      .insert(workout)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await this.db
      .insert(workoutExercise)
      .values(
        exerciseIds.map((exerciseId) => ({
          userId: data.userId,
          workoutId: createdWorkout.id,
          exerciseId,
        }))
      )
      .returning();

    return createdWorkout;
  }

  async get(userId: string, id: string) {
    return await this.db.query.workout.findFirst({
      where: and(eq(workout.id, id), eq(workout.userId, userId)),
      with: {
        exercises: true,
        sessions: true,
      },
    });
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" }
  ): Promise<QueryResponse<WorkoutModel>> {
    const cursorData = options.nextCursor
      ? cursorToKey<{ name: string }>(options.nextCursor)
      : undefined;

    const workouts = await this.db.query.workout.findMany({
      where: and(
        eq(workout.userId, userId),
        cursorData ? gt(workout.name, cursorData.name) : undefined
      ),
      orderBy: options.order === "asc" ? workout.name : desc(workout.name),
      limit: options.limit + 1,
    });

    const hasMore = workouts.length > options.limit;
    const records = hasMore ? workouts.slice(0, -1) : workouts;
    const lastRecord = records[records.length - 1];

    return {
      records,
      cursor: hasMore ? keyToCursor({ name: lastRecord.name }) : "",
    };
  }

  async update(userId: string, id: string, data: Partial<WorkoutInsertModel>) {
    const [result] = await this.db
      .update(workout)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(workout.id, id), eq(workout.userId, userId)))
      .returning();
    return result;
  }

  async delete(userId: string, id: string) {
    await this.db
      .delete(workout)
      .where(and(eq(workout.id, id), eq(workout.userId, userId)));
  }
}
