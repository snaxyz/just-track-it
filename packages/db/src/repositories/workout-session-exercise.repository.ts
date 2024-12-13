import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import {
  workoutSessionExercise,
  WorkoutSessionExerciseModel,
  WorkoutSet,
} from "../schema";

export class WorkoutSessionExerciseRepository extends BaseRepository {
  async create(userId: string, sessionId: string, exerciseId: string) {
    const [result] = await this.db
      .insert(workoutSessionExercise)
      .values({
        userId,
        workoutSessionId: sessionId,
        exerciseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result;
  }

  async createMany(userId: string, sessionId: string, exerciseIds: string[]) {
    if (!exerciseIds.length) return [];

    const [result] = await this.db
      .insert(workoutSessionExercise)
      .values(
        exerciseIds.map((exerciseId) => ({
          userId,
          workoutSessionId: sessionId,
          exerciseId,
          createdAt: new Date(),
          updatedAt: new Date(),
          sets: [],
        }))
      )
      .returning();
    return result;
  }

  async deleteBySessionId(userId: string, sessionId: string) {
    await this.db
      .delete(workoutSessionExercise)
      .where(
        and(
          eq(workoutSessionExercise.workoutSessionId, sessionId),
          eq(workoutSessionExercise.userId, userId)
        )
      );
  }

  async updateSessionExercises(
    userId: string,
    sessionId: string,
    exercises: {
      exerciseId: string;
      sets?: WorkoutSet[];
    }[]
  ) {
    // Delete existing exercises
    await this.deleteBySessionId(userId, sessionId);

    // Add new exercises if any
    if (exercises.length) {
      const [result] = await this.db
        .insert(workoutSessionExercise)
        .values(
          exercises.map((exercise) => ({
            userId,
            workoutSessionId: sessionId,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets || [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
        .returning();
      return result;
    }
  }

  async updateSets(
    userId: string,
    sessionId: string,
    exerciseId: string,
    sets: WorkoutSet[]
  ) {
    const [result] = await this.db
      .update(workoutSessionExercise)
      .set({
        updatedAt: new Date(),
        sets,
        // TODO: should not require this casting, but json column
        // not inferring the type correctly
      } as WorkoutSessionExerciseModel)
      .where(
        and(
          eq(workoutSessionExercise.workoutSessionId, sessionId),
          eq(workoutSessionExercise.exerciseId, exerciseId),
          eq(workoutSessionExercise.userId, userId)
        )
      )
      .returning();
    return result;
  }

  async getBySessionId(userId: string, sessionId: string) {
    return await this.db.query.workoutSessionExercise.findMany({
      where: and(
        eq(workoutSessionExercise.workoutSessionId, sessionId),
        eq(workoutSessionExercise.userId, userId)
      ),
      with: {
        exercise: true,
      },
    });
  }
}
