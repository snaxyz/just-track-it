import { Grow } from "@/components/layout/grow";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon } from "lucide-react";
import { useEffect } from "react";
import { EditWorkoutExerciseModal } from "./edit-workout-exercise-modal";
import { WorkoutHistoryExerciseSet } from "@local/database";

interface Props {
  className?: string;
  exerciseName: string;
  exerciseId: string;
  children: React.ReactNode;
  showUpdateAnimation?: boolean;
  onAnimationComplete: () => void;
  sets: WorkoutHistoryExerciseSet[];
  onDelete: (exerciseId: string) => void;
}

export function WorkoutExercise({
  className,
  exerciseId,
  exerciseName,
  sets,
  children,
  showUpdateAnimation,
  onAnimationComplete,
  onDelete,
}: Props) {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showUpdateAnimation) {
      timeout = setTimeout(onAnimationComplete, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [showUpdateAnimation]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDeleteExercise = () => {
    onDelete(exerciseId);
    onClose();
  };
  const handleUpdateSet = () => {
    console.log("update set");
  };
  const handleDeleteSet = () => {
    console.log("delete set");
  };

  return (
    <>
      <Card
        className={cn(
          showUpdateAnimation && "animate-gradient-outline",
          className
        )}
        fullWidth
      >
        <CardHeader className="capitalize">
          <span
            className="text-nowrap text-ellipsis overflow-hidden mr-2"
            title={exerciseName}
          >
            {exerciseName}
          </span>
          <Grow />
          {/* <Button
          className="mr-2"
          isIconOnly
          size="sm"
          radius="full"
          variant="bordered"
        >
          <ChartLineIcon size={16} />
        </Button> */}
          <Button
            isIconOnly
            size="sm"
            radius="full"
            variant="bordered"
            onClick={onOpen}
          >
            <EditIcon size={16} />
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">{children}</CardBody>
      </Card>
      <EditWorkoutExerciseModal
        isOpen={isOpen}
        onClose={onClose}
        id={exerciseId}
        name={exerciseName}
        sets={sets}
        onDeleteExercise={handleDeleteExercise}
        onUpdateSet={handleUpdateSet}
        onDeleteSet={handleDeleteSet}
      />
    </>
  );
}
