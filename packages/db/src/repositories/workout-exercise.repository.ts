import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { workoutExercise } from "../schema";

export class WorkoutExerciseRepository extends BaseRepository {
  async create(userId: string, workoutId: string, exerciseId: string) {
    const [result] = await this.db
      .insert(workoutExercise)
      .values({
        userId,
        workoutId,
        exerciseId,
      })
      .returning();
    return result;
  }

  async createMany(userId: string, workoutId: string, exerciseIds: string[]) {
    if (!exerciseIds.length) return [];

    const [result] = await this.db
      .insert(workoutExercise)
      .values(
        exerciseIds.map((exerciseId) => ({
          userId,
          workoutId,
          exerciseId,
        }))
      )
      .returning();
    return result;
  }

  async deleteByWorkoutId(userId: string, workoutId: string) {
    await this.db
      .delete(workoutExercise)
      .where(
        and(
          eq(workoutExercise.workoutId, workoutId),
          eq(workoutExercise.userId, userId)
        )
      );
  }

  async updateWorkoutExercises(
    userId: string,
    workoutId: string,
    exerciseIds: string[]
  ) {
    // Delete existing exercises
    await this.deleteByWorkoutId(userId, workoutId);

    // Add new exercises if any
    if (exerciseIds.length) {
      await this.createMany(userId, workoutId, exerciseIds);
    }
  }

  async getByWorkoutId(userId: string, workoutId: string) {
    return await this.db.query.workoutExercise.findMany({
      where: and(
        eq(workoutExercise.workoutId, workoutId),
        eq(workoutExercise.userId, userId)
      ),
      with: {
        exercise: true,
      },
    });
  }
}
