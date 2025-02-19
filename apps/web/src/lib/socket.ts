let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

async function getSocketToken(): Promise<{ url: string; token: string }> {
  const response = await fetch("/api/socket");
  if (!response.ok) {
    throw new Error("Failed to get socket token");
  }
  const data = await response.json();
  return data;
}

export async function getWebSocket(): Promise<WebSocket> {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const { url, token } = await getSocketToken();

    if (!url || !token) {
      throw new Error("WebSocket URL or token is not defined");
    }

    socket = new WebSocket(`${url}?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      reconnectAttempts = 0;
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
        // Handle different message types here
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      socket = null;

      // Attempt to reconnect unless explicitly closed
      if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setTimeout(async () => {
          console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
          await getWebSocket();
        }, RECONNECT_DELAY * reconnectAttempts);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  return socket;
}
