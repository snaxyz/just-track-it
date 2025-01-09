import { getExercisesServer } from "@/server/exercises/get-exercises";

export async function GET() {
  const exercises = await getExercisesServer();
  return Response.json(exercises);
}
