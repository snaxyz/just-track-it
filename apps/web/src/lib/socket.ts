import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function getSocketClient() {
  if (!socket) {
    // Get authenticated socket URL
    const response = await fetch("/api/socket");
    if (!response.ok) {
      throw new Error("Failed to get socket credentials");
    }

    const { url } = await response.json();

    socket = io(url, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect_error", async (error) => {
      console.error("Socket connection error:", error);
      // If we get a token error, try to get a new token
      if (error.message.includes("No socket token found")) {
        try {
          await fetch("/api/socket"); // This will set a new cookie
          socket?.connect(); // Try to reconnect with new token
        } catch (e) {
          console.error("Failed to refresh socket token:", e);
          socket = null;
        }
      } else {
        socket = null;
      }
    });

    socket.on("disconnect", async (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        try {
          await fetch("/api/socket"); // Get new token
          socket?.connect(); // Try to reconnect with new token
        } catch (e) {
          console.error("Failed to refresh socket token:", e);
          socket = null;
        }
      }
    });
  }

  return socket;
}
