import { db } from "@local/db";

export async function getExercises({ userId, search }: { userId: string; search?: string }) {
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
