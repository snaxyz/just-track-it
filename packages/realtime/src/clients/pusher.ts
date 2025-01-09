import Pusher from "pusher";
import { ChatEvent, StreamedChatData } from "../events";

export class PusherClient {
  private client: Pusher;

  constructor() {
    if (
      !process.env.PUSHER_APP_ID ||
      !process.env.PUSHER_APP_KEY ||
      !process.env.PUSHER_SECRET ||
      !process.env.PUSHER_CLUSTER
    ) {
      throw new Error("Pusher environment variables not defined");
    }
    this.client = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: StreamedChatData) {
    await this.client.trigger(channel, event, data);
  }
}
