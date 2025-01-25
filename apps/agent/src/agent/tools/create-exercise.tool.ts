import { CreateExerciseInput, db } from "@local/db";
import { FunctionTool } from "llamaindex";
import { z } from "zod";
import slugify from "slugify";

type CreateExercise = Omit<CreateExerciseInput, "slug">;

const targetAreas = [
  "Upper",
  "Lower",
  "Push",
  "Pull",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes (Butt)",
  "Calves",
  "Abs",
  "Obliques",
  "Core",
  "Full Body",
];

async function createExercise(input: CreateExercise) {
  const slug = slugify(input.name);
  const exercise = await db.exercise.create({
    ...input,
    slug,
  });
  return JSON.stringify(exercise);
}

export const createExerciseTool = FunctionTool.from(createExercise, {
  name: "createExercise",
  description: "Use this function to create a new exercise",
  parameters: z.object({
    userId: z.string().describe("User ID who owns this exercise"),
    name: z.string().describe("Exercise name"),
    targetAreas: z
      .array(z.string())
      .describe(`Target areas this exercise falls targets. Can be one of [${targetAreas.join(",")}]`)
      .optional(),
    trackSets: z.boolean().describe("If this exercise tracks sets").optional(),
    trackReps: z.boolean().describe("If this exercise tracks reps").optional(),
    trackWeight: z.boolean().describe("If this exercise tracks weight").optional(),
    trackDuration: z.boolean().describe("If this exercise tracks duration").optional(),
  }),
});
