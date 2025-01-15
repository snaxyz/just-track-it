import React, { useEffect, useRef, useState } from "react";

interface MessageChunk {
  sequence: number;
  content: string;
  isComplete: boolean;
  // ... other fields
}

function useChat() {
  const [pendingChunks, setPendingChunks] = useState<MessageChunk[]>([]);
  const lastSequence = useRef(-1);

  useEffect(() => {
    const socket = await getSocketClient();

    socket.on("chat:message", (message: MessageChunk) => {
      setPendingChunks((prev) => {
        // Add new chunk to pending
        const newChunks = [...prev, message].sort((a, b) => a.sequence - b.sequence);

        // Process chunks in order
        while (newChunks.length > 0 && newChunks[0].sequence === lastSequence.current + 1) {
          const chunk = newChunks.shift()!;
          lastSequence.current = chunk.sequence;

          // Process the chunk (e.g., append to message content)
          if (chunk.isComplete) {
            // Handle completion
          } else {
            // Handle chunk content
          }
        }

        // Return remaining out-of-order chunks
        return newChunks;
      });
    });
  }, []);

  // ... rest of hook
}
