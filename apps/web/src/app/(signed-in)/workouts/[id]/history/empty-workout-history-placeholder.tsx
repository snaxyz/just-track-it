import { Button } from "@nextui-org/react";
import { ActivityIcon } from "lucide-react";

interface Props {
  onStartWorkoutClick: () => void;
}

export function EmptyWorkoutHistoryPlaceholder({ onStartWorkoutClick }: Props) {
  return (
    <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950 rounded-lg p-6 flex flex-col justify-center items-center min-h-[200px]">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="p-2">
          <ActivityIcon className="w-12 h-12 text-default-400" />
        </div>
        <div className="space-y-2 mb-2">
          <h3 className="text-xl font-medium">No workout history</h3>
          <p className="text-default-500">
            You haven't completed any sessions for this workout.
          </p>
        </div>
        <Button
          variant="solid"
          startContent={<ActivityIcon size={16} />}
          color="primary"
          onPress={onStartWorkoutClick}
        >
          Start workout
        </Button>
      </div>
    </div>
  );
}
