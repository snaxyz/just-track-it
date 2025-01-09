import { ChatPromptTemplate } from "@langchain/core/prompts";

interface TemplateInput {
  message: string;
}

export const isResponseCreatingWorkout =
  ChatPromptTemplate.fromMessages<TemplateInput>([
    [
      "system",
      "Your task is to determine if the user message is creating a workout. Respond with 'yes' or 'no'.",
    ],
    [
      "user",
      "Last message: {message}. Does this message include a workout or multiple workouts? Respond with only 'yes' for a single workout, or 'multiple' for many workouts, or 'no' for no workouts.",
    ],
  ]);
