import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

interface Props {
  onAddClick: () => void;
}

export function EmptyExercisesPlaceholder({ onAddClick }: Props) {
  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg p-2 flex flex-col justify-center items-center min-h-[200px]">
      <div className="text-caption text-center w-full mb-6">
        You have no exercises
      </div>
      <Button
        variant="solid"
        startContent={<PlusIcon size={16} />}
        size="md"
        onClick={onAddClick}
        radius="full"
        color="primary"
      >
        Start workout exercise
      </Button>
    </div>
  );
}
