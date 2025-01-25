"use server";

import { getUserId } from "../user";

interface WorkoutResponse {
  success: boolean;
  error?: string;
}

export async function generateWorkout(message: string): Promise<WorkoutResponse> {
  const endpoint = process.env.AGENT_ENDPOINT;

  if (!endpoint) {
    return {
      success: false,
      error: "AGENT_ENDPOINT is not defined",
    };
  }

  try {
    const userId = await getUserId();
    const response = await fetch(`${endpoint}/generate/workout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        message,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
