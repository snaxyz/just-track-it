import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./chat/chat.module";
import { EventsModule } from "./events/events.module";
import { GenerateModule } from "./generate/generate.module";

@Module({
  imports: [ChatModule, GenerateModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
