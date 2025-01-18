import { Injectable } from "@nestjs/common";
import { BaseMemory, ChatMessage, OpenAI, OpenAIAgent, Settings } from "llamaindex";
import { createExerciseTool } from "./tools/create-exercise.tool";
import { getExercisesTool } from "./tools/get-exercises.tool";
import { createWorkoutTool } from "./tools/create-workout.tool";
import { systemPrompt } from "./prompts/system.prompt";

@Injectable()
export class AgentService {
  private tools = [createExerciseTool, createWorkoutTool, getExercisesTool];

  constructor() {
    Settings.callbackManager.on("llm-tool-call", (event) => {
      console.log(event.detail);
    });
    Settings.callbackManager.on("llm-tool-result", (event) => {
      console.log(event.detail);
    });
  }

  async streamChat({
    message,
    chatHistory,
    userId,
  }: {
    message: string;
    chatHistory: ChatMessage<object>[] | BaseMemory<object>;
    userId: string;
  }) {
    const llm = new OpenAI();
    const agent = new OpenAIAgent({
      llm,
      systemPrompt: systemPrompt(userId),
      tools: this.tools,
      additionalChatOptions: {
        max_completion_tokens: 4000,
      },
    });
    const stream = await agent.chat({
      message,
      stream: true,
      chatHistory,
    });
    return stream;
  }
}
