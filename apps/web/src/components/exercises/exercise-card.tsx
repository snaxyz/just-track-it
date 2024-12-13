import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { EditExerciseModal } from "./edit-exercise-modal";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  id: string;
  name: string;
  categories: string[];
  onUpdate: (id: string, name: string, categories: string[]) => void;
  onDelete: (id: string) => void;
}

export function ExerciseCard({
  className,
  id,
  name,
  categories,
  onUpdate,
  onDelete,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSave = (updatedName: string, updatedCategories: string[]) => {
    onUpdate(id, updatedName, updatedCategories);
    onClose();
  };
  const handleDelete = () => {
    onDelete(id);
    onClose();
  };

  return (
    <>
      <Card
        className={cn("mb-3 bg-zinc-200 dark:bg-zinc-800 z-0", className)}
        shadow="none"
      >
        <CardHeader className="capitalize pb-0">
          <span
            className="text-nowrap text-ellipsis overflow-hidden mr-2"
            title={name}
          >
            {name}
          </span>
          <Grow />
          <IconButton onPress={onOpen}>
            <PencilIcon size={16} />
          </IconButton>
          {/* TODO: move this to edit workout modal */}
          {/* <IconButton onPress={() => onDelete(id)}>
            <TrashIcon size={16} />
          </IconButton> */}
        </CardHeader>
        <CardBody>
          <div className="text-caption-light dark:text-caption text-xs mb-2">
            {categories.length === 0 ? "No categories" : "Categories"}
          </div>
          {categories.length > 0 && (
            <div className="flex capitalize gap-2 flex-wrap items-center">
              {categories.map((c) => (
                <Chip key={c} size="sm">
                  {c}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      <EditExerciseModal
        key={id}
        isOpen={isOpen}
        onClose={onClose}
        name={name}
        categories={categories}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
