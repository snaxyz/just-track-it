import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";

interface TemplateInput {
  message: string;
}

export const generateWorkout = ChatPromptTemplate.fromMessages<TemplateInput>([
  [
    "system",
    "Your task is to generate a workout based on the user message. Assume the user already knows how to perform the exercises. Only output JSON.",
  ],
  [
    "user",
    "Last message: {message}. Please generate a workout based on this message. Output the workout in JSON format.",
  ],
]);

export const workoutStructure = z.object({
  workout: z.object({
    name: z.string().describe("Name of workout"),
    description: z.string().describe("Description of workout"),
    exercises: z.array(
      z.object({
        name: z.string().describe("Name of exercise").optional(),
        description: z
          .string()
          .describe(
            "Description of how to perform exercise. For example recommended sets and reps or duration. Not how to perform the exercise."
          )
          .optional(),
        sets: z.number().describe("Number of sets").optional(),
        reps: z.number().describe("Number of reps").optional(),
        weight: z.number().describe("Weight in lbs").optional(),
        duration: z.number().describe("Duration in minutes").optional(),
      })
    ),
  }),
});
