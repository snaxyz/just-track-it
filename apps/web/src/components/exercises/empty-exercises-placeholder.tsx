import { Button } from "@mui/material";
import { LibrarySquareIcon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
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
      <Button variant="contained" startIcon={<PlusIcon size={16} />} color="primary" onClick={onAddClick}>
        Create exercise
      </Button>
      <Button variant="outlined" startIcon={<MessageSquarePlusIcon size={16} />} color="primary" onClick={onAskAIClick}>
        Ask AI for exercise
      </Button>
    </EmptyPlaceholderCard>
  );
}
