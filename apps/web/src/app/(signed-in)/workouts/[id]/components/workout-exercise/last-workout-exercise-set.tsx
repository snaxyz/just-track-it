import { Grow } from "@/components/layout/grow";
import { cn } from "@/lib/utils";
import { Button, Input } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

interface Props {
  className?: string;
  set: number;
  reps: number;
  weight?: number;
  unit?: "lbs" | "kg";
  exerciseId: string;
  onClick: (exerciseId: string) => void;
}

export function LastWorkoutExerciseSet({
  className,
  set,
  reps,
  weight,
  unit,
  exerciseId,
  onClick,
}: Props) {
  return (
    <Button
      className={cn(
        "min-w-0 block bg-zinc-200 dark:bg-zinc-800 p-3",
        "text-left h-auto",
        className
      )}
      fullWidth
      onClick={() => onClick(exerciseId)}
    >
      <div>Last set</div>
      <div className="flex items-center w-full justify-between">
        <div>Set {set}</div>
        <div>{reps} reps</div>
        {weight && (
          <div>
            {weight} {unit}
          </div>
        )}
      </div>
    </Button>
  );
}
