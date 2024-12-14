import { Button } from "@nextui-org/react";
import { DumbbellIcon, LibraryIcon, PlusIcon } from "lucide-react";

interface Props {
  onAddClick: () => void;
}

export function EmptyExercisesPlaceholder({ onAddClick }: Props) {
  return (
    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-lg p-6 flex flex-col justify-center items-center min-h-[200px]">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <LibraryIcon className="w-12 h-12 text-default-400" />
        <div className="space-y-2">
          <h3 className="text-xl font-medium">No exercises</h3>
          <p className="text-default-500">
            Create your first exercise to get started
          </p>
        </div>
        <Button
          variant="flat"
          startContent={<PlusIcon size={16} />}
          color="primary"
          onPress={onAddClick}
        >
          Create Exercise
        </Button>
      </div>
    </div>
  );
}
