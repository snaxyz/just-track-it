import slugify from "slugify";
import { WorkoutModel, exercise, workout, workoutExercise } from "../schema";
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
  console.log("createSampleWorkouts", userId);
  // First, create all exercises for this user
  const exerciseMap = new Map<string, { id: string }>();

  for (const e of sampleExercises) {
    const [created] = await db.drizzleClient
      .insert(exercise)
      .values({
        userId,
        name: e.name,
        slug: slugify(e.name),
        description: "",
        categories: e.categories,
        keywords: [],
        hasSets: true,
        hasReps: true,
        hasWeight: true,
        hasDuration: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      exerciseMap.set(e.name, created);
    } else {
      // If insert was skipped, fetch the existing exercise
      const existing = await db.exercise.getByName(userId, e.name);
      if (existing) {
        exerciseMap.set(e.name, existing);
      }
    }
  }

  // Insert each workout and its exercises
  for (const sample of sampleWorkouts) {
    // Create workout with ON CONFLICT DO NOTHING
    const [w] = await db.drizzleClient
      .insert(workout)
      .values({
        userId,
        name: sample.workout.name,
        slug: slugify(sample.workout.name),
        description: sample.workout.description ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoNothing()
      .returning();

    if (!w) continue; // Skip if workout already exists

    // Get the exercise IDs that we created/found
    const exerciseIds = sample.exercises
      .map((name) => exerciseMap.get(name)?.id)
      .filter(Boolean);

    // Create workout exercises with ON CONFLICT DO NOTHING
    if (exerciseIds.length > 0) {
      await db.drizzleClient
        .insert(workoutExercise)
        .values(
          exerciseIds.map((exerciseId) => ({
            userId,
            workoutId: w.id,
            exerciseId,
          }))
        )
        .onConflictDoNothing();
    }
  }
}
