import { Grow } from "@/components/layout/grow";
import { cn } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { EditIcon } from "lucide-react";
import { useEffect } from "react";

interface Props {
  className?: string;
  exerciseName: string;
  exerciseId: string;
  children: React.ReactNode;
  showUpdateAnimation?: boolean;
  onAnimationComplete: () => void;
}

export function WorkoutExercise({
  className,
  exerciseName,
  children,
  showUpdateAnimation,
  onAnimationComplete,
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

  return (
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
        <Button isIconOnly size="sm" radius="full" variant="bordered">
          <EditIcon size={16} />
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">{children}</CardBody>
    </Card>
  );
}
