import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import { Button, useDisclosure } from "@nextui-org/react";
import {
  ActivityIcon,
  EditIcon,
  HistoryIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { EditWorkoutModal } from "../edit-workout-modal";

interface Props {
  id: string;
  name: string;
  description: string;
  children: React.ReactNode;
  onStartWorkout: (workoutId: string) => void;
  onEditClick: (id: string) => void;
}

export function WorkoutCard({
  id,
  name,
  description,
  children,
  onStartWorkout,
  onEditClick,
}: Props) {
  return (
    <div className="rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3">
      <div className="flex w-full p-2 gap-2">
        <div>{name}</div>
        <Grow />
        <IconButton as={Link} href={`/workouts/${id}/history`}>
          <HistoryIcon size={16} />
        </IconButton>
        <IconButton onPress={() => onEditClick(id)}>
          <EditIcon size={16} />
        </IconButton>
        {/* <IconButton>
          <MoreHorizontalIcon size={16} />
        </IconButton> */}
      </div>
      {description && <div className="p-2">{description}</div>}
      {children}
      <div className="w-full p-2">
        <Button
          fullWidth
          variant="flat"
          startContent={<ActivityIcon size={16} />}
          size="sm"
          radius="lg"
          color="secondary"
          onPress={() => onStartWorkout(id)}
        >
          Start workout
        </Button>
      </div>
    </div>
  );
}
