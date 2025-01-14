import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { StreamChatMessageDto } from "./dto/stream-chat-message.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("stream")
  async streamMessage(@Body() streamChatMessageDto: StreamChatMessageDto) {
    return this.chatService.streamMessage(streamChatMessageDto);
  }

  @Get("test")
  async test() {
    return "hello monkey";
  }
}
