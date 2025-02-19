import { Config } from "./config";
import { AgentService } from "./agent/agent.service";
import { ChatService } from "./chat/chat.service";
import { GenerateService } from "./generate/generate.service";
import { EventsGateway } from "./events/events.gateway";

export interface Context {
  chatService: ChatService;
  generateService: GenerateService;
  eventsGateway: EventsGateway;
}

export function createContext(config: Config): Context {
  const eventsGateway = new EventsGateway(config);
  const agentService = new AgentService(config);

  return {
    chatService: new ChatService(agentService, eventsGateway),
    generateService: new GenerateService(agentService, eventsGateway),
    eventsGateway,
  };
}
