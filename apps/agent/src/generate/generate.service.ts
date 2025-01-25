import { Injectable } from "@nestjs/common";
import { db } from "@local/db";
import { AgentService } from "src/agent/agent.service";
import { EventsGateway } from "../events/events.gateway";

@Injectable()
export class GenerateService {
  constructor(
    private readonly agentService: AgentService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async generateWorkout(generateId: string, userId: string, message: string) {
    const stream = await this.agentService.streamChat({
      message: `Generate a workout plan based on this request: ${message}.`,
      chatHistory: [],
      userId,
    });

    const responseChunks: string[] = [];

    for await (const chunk of stream) {
      const content = chunk.message.content.toString();
      responseChunks.push(content);
      this.eventsGateway.emitGenerateWorkoutMessage(generateId, { content });
    }
    this.eventsGateway.emitGenerateWorkoutMessage(generateId, { content: "", finishReason: "stop" });
  }
}
