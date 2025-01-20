import { Button } from "@mui/material";
import { LibrarySquareIcon, MessageSquarePlusIcon, PlusIcon } from "lucide-react";
import { EmptyPlaceholderCard } from "../cards";

interface Props {
  onAddClick: () => void;
}

export function EmptyExercisesPlaceholder({ onAddClick }: Props) {
  return (
    <EmptyPlaceholderCard
      Icon={LibrarySquareIcon}
      title="No exercises"
      message="Create your first exercise to get started"
    >
      <Button variant="contained" startIcon={<PlusIcon size={16} />} color="primary" onClick={onAddClick}>
        Create exercise
      </Button>
    </EmptyPlaceholderCard>
  );
}
