import { Injectable } from "@nestjs/common";
import { BaseMemory, ChatMessage, OpenAI, OpenAIAgent } from "llamaindex";
import { createExerciseTool } from "./tools/create-exercise.tool";

@Injectable()
export class AgentService {
  async streamChat({
    message,
    chatHistory,
    userId,
  }: {
    message: string;
    chatHistory: ChatMessage<object>[] | BaseMemory<object>;
    userId: string;
  }) {
    const systemPrompt = `You are a fitness guru with expertise in building workouts for your clients.
    The following chat history is the the userId "${userId}".
    Refrain from asking any questions related to PII.
    You speak in a professional and friendly manner.`;
    const llm = new OpenAI();
    const agent = new OpenAIAgent({
      llm,
      systemPrompt,
      tools: [createExerciseTool],
    });
    const stream = await agent.chat({
      message,
      stream: true,
      chatHistory,
    });
    return stream;
  }
}
