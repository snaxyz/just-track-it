import { Grow } from "@/components/layout/grow";
import { cn } from "@/lib/utils";
import { WeightUnit } from "@local/database";
import { Button, Input } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

interface Props {
  className?: string;
  set?: number | null;
  reps?: number | null;
  weight?: number | null;
  unit?: WeightUnit | null;
  exerciseId: string;
  onPress: (exerciseId: string) => void;
}

export function LastWorkoutExerciseSet({
  className,
  set,
  reps,
  weight,
  unit,
  exerciseId,
  onPress,
}: Props) {
  return (
    <Button
      className={cn(
        "min-w-0 block bg-zinc-200 dark:bg-zinc-800 p-3",
        "text-left h-auto",
        className
      )}
      fullWidth
      onPress={() => onPress(exerciseId)}
    >
      <div>Last set</div>
      <div className="flex items-center w-full justify-between mb-2">
        <div>Set {set}</div>
        <div>{reps} reps</div>
        {weight && (
          <div>
            {weight} {unit}
          </div>
        )}
      </div>
      <div className="text-caption-light dark:text-caption text-xs italic text-center">
        Add another set
      </div>
    </Button>
  );
}
