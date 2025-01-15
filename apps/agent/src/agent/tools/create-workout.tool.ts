import { CreateWorkoutInput, db } from "@local/db";
import { FunctionTool } from "llamaindex";
import { z } from "zod";

async function createWorkout(input: CreateWorkoutInput) {
  const workout = await db.workout.create(input);
  return JSON.stringify(workout);
}

export const createWorkoutTool = FunctionTool.from(createWorkout, {
  name: "createWorkout",
  description: "Use this function to create a workout",
  parameters: z.object({
    name: z.string().describe("Workout name"),
    userId: z.string().describe("User ID who owns this workout"),
  }),
});
