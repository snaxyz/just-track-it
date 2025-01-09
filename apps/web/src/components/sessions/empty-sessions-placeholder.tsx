import { Button } from "@nextui-org/react";
import { ActivityIcon, MessageSquarePlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
  onAskAIClick: () => void;
}

export function EmptySessionsPlaceholder({ onAddClick, onAskAIClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={ActivityIcon}
      title="No recent workouts"
      message="Start a new workout to track your progress"
    >
      <Button
        variant="solid"
        startContent={<ActivityIcon size={16} />}
        color="primary"
        onPress={onAddClick}
      >
        Start new workout
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
