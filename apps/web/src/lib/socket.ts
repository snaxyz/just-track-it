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
      withCredentials: true, // This will send the HTTP-only cookies
      autoConnect: true,
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      socket = null;
    });
  }

  return socket;
}
