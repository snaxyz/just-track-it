import slugify from "slugify";
import { WorkoutModel } from "../schema";
import sampleExercises from "./sample-exercises.json";
import sampleWorkoutsData from "./sample-workouts.json";

export interface SampleWorkout {
  workout: Pick<WorkoutModel, "name" | "slug" | "description">;
  exercises: string[]; // exercise names that we'll need to look up by name
}

export const sampleWorkouts: SampleWorkout[] = sampleWorkoutsData.map(
  (workout) => ({
    workout: {
      name: workout.name,
      slug: slugify(workout.name),
      description: workout.description,
    },
    exercises: workout.exercises.map((e) => e.name),
  })
);

// Helper function to insert sample workouts for a new user
export async function createSampleWorkouts(
  db: any,
  userId: string
): Promise<void> {
  // First, create all exercises for this user
  const exerciseMap = new Map<string, { id: string }>();

  for (const exercise of sampleExercises) {
    const created = await db.exercise.create({
      userId,
      name: exercise.name,
      slug: slugify(exercise.name),
      description: "",
      categories: exercise.categories,
      keywords: [],
      hasSets: true,
      hasReps: true,
      hasWeight: true,
      hasDuration: false,
    });
    exerciseMap.set(exercise.name, created);
  }

  // Insert each workout and its exercises
  for (const sample of sampleWorkouts) {
    // Create the workout
    const workout = await db.workout.create({
      userId,
      name: sample.workout.name,
      slug: sample.workout.slug,
      description: sample.workout.description ?? "",
    });

    // Get the exercise IDs that we just created
    const exerciseIds = sample.exercises
      .map((name) => exerciseMap.get(name)?.id)
      .filter(Boolean);

    // Create workout exercises
    if (exerciseIds.length > 0) {
      await db.workoutExercise.createMany(userId, workout.id, exerciseIds);
    }
  }
}
