import { getChatMessagesServer } from "@/server/chat/get-chat-messages";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const chatId = (await params).id;
  const chatMessages = await getChatMessagesServer(chatId);
  return Response.json(chatMessages);
}
