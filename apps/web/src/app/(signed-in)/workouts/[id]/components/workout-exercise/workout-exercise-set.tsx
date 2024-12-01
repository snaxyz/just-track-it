import { cn } from "@/lib/utils";
import { Input } from "@nextui-org/react";

interface Props {
  className?: string;
  set: number;
  reps: number;
  weight?: number;
}

export function WorkoutExerciseSet({ className, set, reps, weight }: Props) {
  return (
    <div className={cn(className)}>
      <div>Set {set}</div>
      <Input
        label="Reps"
        type="number"
        value={reps.toString()}
        size="sm"
        variant="bordered"
      />
      {weight && (
        <Input
          label="Weight"
          type="number"
          value={weight.toString()}
          size="sm"
          variant="bordered"
        />
      )}
    </div>
  );
}
