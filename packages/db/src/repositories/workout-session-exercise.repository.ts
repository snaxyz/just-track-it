import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { workoutSessionExercise } from "../schema";

export class WorkoutSessionExerciseRepository extends BaseRepository {
  async create(userId: string, sessionId: string, exerciseId: string) {
    const [result] = await this.db
      .insert(workoutSessionExercise)
      .values({
        userId,
        workoutSessionId: sessionId,
        exerciseId,
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
        }))
      )
      .returning();
    return result;
  }

  async deleteBySessionId(userId: string, sessionId: string) {
    await this.db
      .delete(workoutSessionExercise)
      .where(eq(workoutSessionExercise.workoutSessionId, sessionId));
  }

  async updateSessionExercises(
    userId: string,
    sessionId: string,
    exerciseIds: string[]
  ) {
    // Delete existing exercises
    await this.deleteBySessionId(userId, sessionId);

    // Add new exercises if any
    if (exerciseIds.length) {
      await this.createMany(userId, sessionId, exerciseIds);
    }
  }

  async getBySessionId(userId: string, sessionId: string) {
    return await this.db.query.workoutSessionExercise.findMany({
      where: and(
        eq(workoutSessionExercise.workoutSessionId, sessionId),
        eq(workoutSessionExercise.userId, userId)
      ),
      with: {
        exercise: true,
        sets: true,
      },
    });
  }
}
