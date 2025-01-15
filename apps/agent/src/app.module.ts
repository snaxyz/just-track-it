import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./chat/chat.module";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [ChatModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
