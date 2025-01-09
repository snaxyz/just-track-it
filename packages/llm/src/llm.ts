import { BaseMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { generateTitleFromMessageTemplate } from "./templates/generate-title.template";
import { isResponseCreatingWorkout } from "./templates/is-response-creating-workout.template";
import {
  generateWorkout,
  workoutStructure,
} from "./templates/generate-workout";

interface SendChatMessageInput {
  messages: BaseMessage[];
  options?: {
    model: string;
  };
}

export class LLM {
  constructor() {}

  async streamChatMessage({ messages, options }: SendChatMessageInput) {
    const model = new ChatOpenAI({
      model: options?.model ?? "gpt-4o-mini",
    });
    return await model.stream(messages);
  }

  async sendChatMessage({ messages }: SendChatMessageInput) {
    const parser = new StringOutputParser();
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
    });
    const chain = model.pipe(parser);
    return await chain.invoke(messages);
  }

  async generateTitleFromMessage(message: string) {
    const parser = new StringOutputParser();
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
    });
    const chain = generateTitleFromMessageTemplate.pipe(model).pipe(parser);
    return await chain.invoke({ message });
  }

  async isMessageCreatingWorkout(
    message: string
  ): Promise<"yes" | "no" | "multiple"> {
    const parser = new StringOutputParser();
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });
    const chain = isResponseCreatingWorkout.pipe(model).pipe(parser);
    const res = await chain.invoke({
      message,
    });
    return res as "yes" | "no" | "multiple";
  }

  async createWorkout(message: string) {
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });
    const workoutOutput = await generateWorkout
      .pipe(model.withStructuredOutput(workoutStructure))
      .invoke({
        message,
      });
    return workoutOutput;
  }
}
