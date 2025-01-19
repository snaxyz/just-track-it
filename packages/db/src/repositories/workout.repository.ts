import { and, eq, gt, desc, sql } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import {
  workout,
  WorkoutModel,
  WorkoutInsertModel,
  workoutExercise,
  WorkoutWithRelations,
  WorkoutExerciseWithRelations,
  exercise,
} from "../schema";
import { QueryResponse, keyToCursor, cursorToKey, QueryOptions } from "../types";

export type CreateWorkoutInput = Omit<WorkoutInsertModel, "id" | "createdAt" | "updatedAt">;

export class WorkoutRepository extends BaseRepository {
  async create(data: CreateWorkoutInput) {
    const timestamp = new Date().toISOString();
    const [result] = await this.db
      .insert(workout)
      .values({
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();
    return result;
  }

  async createWithExercises(
    data: CreateWorkoutInput,
    exerciseIds: string[],
  ): Promise<Omit<WorkoutWithRelations, "sessions">> {
    const timestamp = new Date().toISOString();
    const [createdWorkout] = await this.db
      .insert(workout)
      .values({
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    if (exerciseIds.length === 0) {
      return {
        ...createdWorkout,
        exercises: [],
      };
    }

    const [result] = await this.db
      .insert(workoutExercise)
      .values(
        exerciseIds.map((exerciseId) => ({
          userId: data.userId,
          workoutId: createdWorkout.id,
          exerciseId,
        })),
      )
      .returning();

    return {
      ...createdWorkout,
      exercises: [
        {
          id: result.id,
          userId: result.userId,
          workoutId: result.workoutId,
          exerciseId: result.exerciseId,
          description: "",
          exercise: await this.db.query.exercise.findFirst({
            where: eq(exercise.id, result.exerciseId),
          }),
        },
      ],
    };
  }

  async get(userId: string, id: string) {
    return await this.db.query.workout.findFirst({
      where: and(eq(workout.id, id), eq(workout.userId, userId)),
      with: {
        exercises: {
          with: {
            exercise: true,
          },
        },
        sessions: true,
      },
    });
  }

  async query(
    userId: string,
    options: QueryOptions = { limit: 20, order: "asc" },
  ): Promise<QueryResponse<WorkoutModel>> {
    const cursorData = options.nextCursor ? cursorToKey<{ name: string }>(options.nextCursor) : undefined;

    const workouts = await this.db.query.workout.findMany({
      where: and(eq(workout.userId, userId), cursorData ? gt(workout.name, cursorData.name) : undefined),
      orderBy: options.order === "asc" ? workout.name : desc(workout.name),
      limit: options.limit + 1,
      with: {
        exercises: {
          with: {
            exercise: true,
          },
        },
      },
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
    await this.db
      .update(workout)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(workout.id, id), eq(workout.userId, userId)));

    return await this.db.query.workout.findFirst({
      where: and(eq(workout.id, id), eq(workout.userId, userId)),
    });
  }

  async delete(userId: string, id: string) {
    await this.db.delete(workout).where(and(eq(workout.id, id), eq(workout.userId, userId)));
  }
}
