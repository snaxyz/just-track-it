import { Context, SQSEvent } from "aws-lambda";
import type { ChatStreamEvent, Event } from "./types";
import { streamChatMessage } from "./stream-chat-message";
import { reviewLastResponse } from "./review-last-reponse";
import { createWorkout } from "./create-workout";

export async function handler(event: Event | SQSEvent, context: Context) {
  console.log("Received event", JSON.stringify(event));
  try {
    if (isInvokeEvent(event)) {
      return await invokeEvent(event);
    }
    await Promise.all(
      event.Records.map((r) => {
        const parsedEvent = JSON.parse(r.body) as Event;
        return invokeEvent(parsedEvent);
      })
    );
  } catch (e) {
    console.error("Unhandled error", e);
    console.error(e);
  }
}

function isInvokeEvent(event: Event | SQSEvent): event is Event {
  return Boolean((event as Event).type);
}

async function invokeEvent(event: Event) {
  switch (event.type) {
    case "STREAM_CHAT_MESSAGE":
      return await streamChatMessage(event);
    case "REVIEW_LAST_RESPONSE":
      return await reviewLastResponse(event);
    case "CREATE_WORKOUT":
      return await createWorkout(event);
    case "CREATE_MULTIPLE_WORKOUTS":
    default:
      console.log("Unhandled event", JSON.stringify(event));
  }
}
