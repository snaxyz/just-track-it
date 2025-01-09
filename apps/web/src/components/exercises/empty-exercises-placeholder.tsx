import { Button } from "@nextui-org/react";
import {
  LibrarySquareIcon,
  MessageSquarePlusIcon,
  PlusIcon,
} from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
  onAskAIClick: () => void;
}

export function EmptyExercisesPlaceholder({ onAddClick, onAskAIClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={LibrarySquareIcon}
      title="No exercises"
      message="Create your first exercise to get started"
    >
      <Button
        variant="solid"
        startContent={<PlusIcon size={16} />}
        color="primary"
        onPress={onAddClick}
      >
        Create exercise
      </Button>
      <Button
        variant="bordered"
        startContent={<MessageSquarePlusIcon size={16} />}
        color="primary"
        onPress={onAskAIClick}
      >
        Ask AI for exercise
      </Button>
    </EmptyPlaceholderCard>
  );
}
