import { CreateWorkoutInput, db } from "@local/db";
import slugify from "slugify";

type CreateWorkout = Omit<CreateWorkoutInput, "slug">;

export async function createWorkout(input: CreateWorkout & { exerciseIds?: string[] }) {
  const { exerciseIds, ...workoutData } = input;
  const slug = slugify(input.name);

  if (exerciseIds && exerciseIds.length > 0) {
    return await db.workout.createWithExercises(
      {
        ...workoutData,
        slug,
      },
      exerciseIds,
    );
  }

  const workout = await db.workout.create({
    ...workoutData,
    slug,
  });
  return JSON.stringify(workout);
}
