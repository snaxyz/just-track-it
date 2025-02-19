import { CreateExerciseInput, db } from "@local/db";
import slugify from "slugify";

type CreateExercise = Omit<CreateExerciseInput, "slug">;

const targetAreas = [
  "Upper",
  "Lower",
  "Push",
  "Pull",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes (Butt)",
  "Calves",
  "Abs",
  "Obliques",
  "Core",
  "Full Body",
];

export async function createExercise(input: CreateExercise) {
  const slug = slugify(input.name);
  const exercise = await db.exercise.create({
    ...input,
    slug,
  });
  return JSON.stringify(exercise);
}
