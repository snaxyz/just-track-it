import { and, eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import { workoutExercise, WorkoutExerciseModel } from "../schema";

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

  async createMany(
    userId: string,
    workoutId: string,
    exerciseIds: string[]
  ): Promise<WorkoutExerciseModel[]> {
    if (exerciseIds.length === 0) return [];

    const results = await this.db
      .insert(workoutExercise)
      .values(
        exerciseIds.map((exerciseId) => ({
          userId,
          workoutId,
          exerciseId,
        }))
      )
      .returning();
    return results;
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
  ): Promise<WorkoutExerciseModel[]> {
    // Delete existing exercises
    await this.deleteByWorkoutId(userId, workoutId);

    // Add new exercises if any
    if (exerciseIds.length > 0) {
      return await this.createMany(userId, workoutId, exerciseIds);
    }

    return [];
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
