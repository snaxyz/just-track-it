import { Module } from "@nestjs/common";
import { GenerateController } from "./generate.controller";
import { GenerateService } from "./generate.service";
import { AgentModule } from "src/agent/agent.module";

@Module({
  imports: [AgentModule],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
