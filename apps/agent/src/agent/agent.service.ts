import OpenAI from "openai";
import { ReadableStream } from "stream/web";
import { systemPrompt } from "./prompts/system.prompt";
import { createExercise } from "./tools/create-exercise.tool";
import { getExercises } from "./tools/get-exercises.tool";
import { createWorkout } from "./tools/create-workout.tool";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

const tools: ChatCompletionCreateParamsBase["tools"] = [
  {
    type: "function",
    function: {
      name: "createExercise",
      description: "Use this function to create a new exercise",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID who owns this exercise" },
          name: { type: "string", description: "Exercise name" },
          targetAreas: {
            type: "array",
            items: { type: "string" },
            description: "Target areas this exercise falls targets",
          },
          trackSets: { type: "boolean", description: "If this exercise tracks sets" },
          trackReps: { type: "boolean", description: "If this exercise tracks reps" },
          trackWeight: { type: "boolean", description: "If this exercise tracks weight" },
          trackDuration: { type: "boolean", description: "If this exercise tracks duration" },
        },
        required: ["userId", "name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getExercises",
      description: "Use this function to get a list of exercises for a user",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID to get exercises for" },
          search: { type: "string", description: "Optional search term to filter exercises" },
        },
        required: ["userId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "createWorkout",
      description: "Use this function to create a workout with optional exercises",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID who owns this workout" },
          name: { type: "string", description: "Workout name" },
          description: { type: "string", description: "Workout description" },
          exerciseIds: {
            type: "array",
            items: { type: "string" },
            description: "Array of exercise IDs to add to this workout",
          },
        },
        required: ["userId", "name"],
      },
    },
  },
];

export class AgentService {
  private openai: OpenAI;

  constructor(config: { openai: { apiKey: string } }) {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
  }

  async stream({
    message,
    chatHistory,
    userId,
  }: {
    message: string;
    chatHistory: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    userId: string;
  }): Promise<ReadableStream> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt(userId) }, ...chatHistory, { role: "user", content: message }],
      tools: tools,
      stream: true,
    });

    return new ReadableStream({
      async start(controller) {
        let functionCall = null;

        try {
          for await (const chunk of response) {
            if (chunk.choices[0]?.delta?.function_call) {
              const { name, arguments: args } = chunk.choices[0].delta.function_call;
              if (!functionCall) {
                functionCall = { name, arguments: args };
              } else {
                functionCall.arguments += args;
              }
            } else if (chunk.choices[0]?.delta?.content) {
              controller.enqueue(chunk.choices[0].delta.content);
            }
          }

          if (functionCall) {
            const { name, arguments: args } = functionCall;
            let result;

            switch (name) {
              case "createExercise":
                result = await createExercise(JSON.parse(args));
                break;
              case "getExercises":
                result = await getExercises(JSON.parse(args));
                break;
              case "createWorkout":
                result = await createWorkout(JSON.parse(args));
                break;
            }

            const functionResponse = await this.openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt(userId) },
                ...chatHistory,
                { role: "user", content: message },
                { role: "assistant", content: null, function_call: functionCall },
                { role: "function", name: functionCall.name, content: result },
              ],
              stream: true,
            });

            for await (const chunk of functionResponse) {
              if (chunk.choices[0]?.delta?.content) {
                controller.enqueue(chunk.choices[0].delta.content);
              }
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}
