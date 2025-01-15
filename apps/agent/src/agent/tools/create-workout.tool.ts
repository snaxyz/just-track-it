import { CreateWorkoutInput, db } from "@local/db";
import { FunctionTool } from "llamaindex";
import { z } from "zod";
import slugify from "slugify";

type CreateWorkout = Omit<CreateWorkoutInput, "slug">;

async function createWorkout(input: CreateWorkout & { exerciseIds?: string[] }) {
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

export const createWorkoutTool = FunctionTool.from(createWorkout, {
  name: "createWorkout",
  description: "Use this function to create a workout with optional exercises",
  parameters: z.object({
    userId: z.string().describe("User ID who owns this workout"),
    name: z.string().describe("Workout name"),
    description: z.string().describe("Workout description").optional(),
    exerciseIds: z
      .array(z.string())
      .describe("Array of exercise IDs to add to this workout. Use getExercises to find exercises first")
      .optional(),
  }),
});
