import { Injectable } from "@nestjs/common";
import { BaseMemory, ChatMessage, OpenAI, OpenAIAgent } from "llamaindex";

@Injectable()
export class AgentService {
  async streamChat({
    message,
    chatHistory,
  }: {
    message: string;
    chatHistory: ChatMessage<object>[] | BaseMemory<object>;
  }) {
    const llm = new OpenAI();
    const agent = new OpenAIAgent({
      llm,
      tools: [],
    });
    const stream = await agent.chat({
      message,
      stream: true,
      chatHistory,
    });
    return stream;
  }
}
