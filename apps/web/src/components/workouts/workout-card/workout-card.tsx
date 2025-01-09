import { GradientCard } from "@/components/cards";
import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ActivityIcon, EditIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  description: string | null;
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
    <GradientCard className="mb-3 z-0" shadow="none">
      <CardHeader className="capitalize pb-0">
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
      </CardHeader>
      <CardBody>
        {description && <div className="mb-4">{description}</div>}
        {children}
        <div>
          <Button
            fullWidth
            variant="bordered"
            startContent={<ActivityIcon size={16} />}
            radius="lg"
            color="secondary"
            onPress={() => onStartWorkout(id)}
          >
            Start workout
          </Button>
        </div>
      </CardBody>
    </GradientCard>
  );
}
