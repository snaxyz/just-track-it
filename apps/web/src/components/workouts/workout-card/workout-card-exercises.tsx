import { WorkoutExerciseWithRelations } from "@local/db";
import { Chip } from "@nextui-org/react";

interface Props {
  exercises: WorkoutExerciseWithRelations[];
}

export function WorkoutCardExercises({ exercises }: Props) {
  if (exercises.length === 0) {
    return (
      <div className="p-2">
        <div className="text-caption-light dark:text-caption text-xs mb-2">
          No exercises
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="text-caption-light dark:text-caption text-xs mb-2">
        {exercises.length} Exercise
        {exercises.length > 1 ? "s" : ""}
      </div>
      <div className="flex w-full gap-2 flex-wrap">
        {exercises.map((e) => (
          <Chip key={e.exerciseId} className="capitalize">
            {e.exercise.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
