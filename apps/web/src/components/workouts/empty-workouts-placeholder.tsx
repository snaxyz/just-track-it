import { Button } from "@nextui-org/react";
import { DumbbellIcon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
  onAskAIClick: () => void;
}

export function EmptyWorkoutsPlaceholder({ onAddClick, onAskAIClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={DumbbellIcon}
      title="No workouts"
      message="Create your first workout to get started"
    >
      <Button
        variant="solid"
        startContent={<PlusIcon size={16} />}
        color="primary"
        onPress={onAddClick}
      >
        Create workout
      </Button>
      <Button
        variant="bordered"
        startContent={<MessageSquarePlusIcon size={16} />}
        color="primary"
        onPress={onAskAIClick}
      >
        Ask AI for workout
      </Button>
    </EmptyPlaceholderCard>
  );
}
