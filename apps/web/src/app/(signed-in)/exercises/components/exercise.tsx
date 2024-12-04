import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import { Chip, useDisclosure } from "@nextui-org/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { EditExerciseModal } from "./edit-exercise-modal";

interface Props {
  className?: string;
  id: string;
  name: string;
  categories: string[];
  onUpdate: (id: string, name: string, categories: string[]) => void;
  onDelete: (id: string) => void;
}

export function Exercise({
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

  return (
    <>
      <div className={className}>
        <div className="flex items-center gap-1 mb-2">
          <span className="capitalize">{name}</span>
          <Grow />
          <IconButton onClick={onOpen}>
            <PencilIcon size={16} />
          </IconButton>
          <IconButton onClick={() => onDelete(id)}>
            <TrashIcon size={16} />
          </IconButton>
        </div>
        <div className="text-caption text-xs mb-1">
          {categories.length === 0 ? "No categories" : "Categories"}
        </div>
        {categories.length > 0 && (
          <div className="flex capitalize gap-2 flex-wrap items-center justify-end">
            {categories.map((c) => (
              <Chip key={c} size="sm" variant="flat">
                {c}
              </Chip>
            ))}
          </div>
        )}
      </div>
      <EditExerciseModal
        key={id}
        isOpen={isOpen}
        onClose={onClose}
        name={name}
        categories={categories}
        onSave={handleSave}
      />
    </>
  );
}
