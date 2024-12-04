import { WorkoutHistoryExerciseSet } from "@local/database";

interface Props {
  className?: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutHistoryExerciseSet[];
}

export function HistoryExercise({
  className,
  exerciseId,
  exerciseName,
  sets,
}: Props) {
  return (
    <div key={exerciseId} className={className}>
      <div className="text-caption capitalize">{exerciseName}</div>
      {sets.map((set, ind) => (
        <div key={exerciseId + ind}>
          <div className="flex items-center w-full justify-between">
            <div className="basis-4/12">Set {ind + 1}</div>
            <div className="basis-4/12">{set.reps} reps</div>
            {set.weight && (
              <div className="basis-4/12">
                {set.weight} {set.unit}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
