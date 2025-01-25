import { db } from "@local/db";
import { FunctionTool } from "llamaindex";
import { z } from "zod";

async function getExercises({ userId, search }: { userId: string; search?: string }) {
  // Get all exercises for the user
  const exercises = await db.exercise.query(userId, {
    limit: 100,
    order: "asc",
  });

  // Filter by search term if provided
  const filteredExercises = search
    ? exercises.records.filter(
        (ex) =>
          ex.name.toLowerCase().includes(search.toLowerCase()) ||
          ex.targetAreas?.some((cat) => cat.toLowerCase().includes(search.toLowerCase())),
      )
    : exercises.records;

  return JSON.stringify({
    exercises: filteredExercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      targetAreas: ex.targetAreas,
      trackSets: ex.trackSets,
      trackReps: ex.trackReps,
      trackWeight: ex.trackWeight,
      trackDuration: ex.trackDuration,
    })),
    total: filteredExercises.length,
  });
}

export const getExercisesTool = FunctionTool.from(getExercises, {
  name: "getExercises",
  description:
    "Use this function to get a list of exercises for a user. You can optionally filter by name or category.",
  parameters: z.object({
    userId: z.string().describe("User ID to get exercises for"),
    search: z.string().optional().describe("Optional search term to filter exercises by name or category"),
  }),
});
