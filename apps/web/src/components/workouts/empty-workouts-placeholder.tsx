import { Button } from "@nextui-org/react";
import { ActivityIcon } from "lucide-react";

interface Props {
  onAddClick: () => void;
}

export function EmptyWorkoutsPlaceholder({ onAddClick }: Props) {
  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg p-2 flex flex-col justify-center items-center min-h-[200px]">
      <div className="text-caption-light dark:text-caption text-center w-full mb-6">
        You have no workouts
      </div>
      <Button
        variant="solid"
        startContent={<ActivityIcon size={16} />}
        size="md"
        onPress={onAddClick}
        radius="lg"
        color="primary"
      >
        Start workout
      </Button>
    </div>
  );
}
