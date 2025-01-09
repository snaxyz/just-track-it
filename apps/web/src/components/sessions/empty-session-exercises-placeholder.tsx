import { Button } from "@nextui-org/react";
import { DumbbellIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
}

export function EmptySessionExercisePlaceholder({ onAddClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={DumbbellIcon}
      title="No sets"
      message="Add your first exercise to get started"
    >
      <Button
        variant="solid"
        startContent={<PlusIcon size={16} />}
        color="primary"
        onPress={onAddClick}
      >
        Add set
      </Button>
    </EmptyPlaceholderCard>
  );
}
