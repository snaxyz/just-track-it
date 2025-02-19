import { AgentService } from "@/agent/agent.service";
import { EventsGateway } from "@/events/events.gateway";
import { GenerateWorkoutInput } from "./types";

export class GenerateService {
  constructor(
    private readonly agentService: AgentService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async generateWorkout(input: GenerateWorkoutInput) {
    const { message, userId, generateId } = input;
    const stream = await this.agentService.stream({
      message: `Generate a workout plan based on this request: ${message}.`,
      chatHistory: [],
      userId,
    });

    const responseChunks: string[] = [];

    for await (const chunk of stream) {
      responseChunks.push(chunk);
      this.eventsGateway.emitGenerateWorkoutMessage(generateId, { content: chunk });
    }
    this.eventsGateway.emitGenerateWorkoutMessage(generateId, { content: "", finishReason: "stop" });
  }
}
