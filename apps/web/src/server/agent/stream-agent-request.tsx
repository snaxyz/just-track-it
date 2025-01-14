"use server";

export async function streamAgentRequest({
  userId,
  chatId,
  message,
}: {
  userId: string;
  chatId: string;
  message: string;
}) {
  const endpoint = process.env.AGENT_ENDPOINT;

  if (!endpoint) {
    throw new Error("AGENT_ENDPOINT is not defined");
  }

  const response = await fetch(`${endpoint}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      chatId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return true;
}
