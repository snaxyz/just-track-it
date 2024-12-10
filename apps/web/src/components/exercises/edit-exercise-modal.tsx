import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Selection,
} from "@nextui-org/react";
import { DeleteIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ExerciseCategorySelect } from "./exercise-category-select";
import { useState } from "react";
import { IconButton } from "../icon-button";
import { Grow } from "../layout/grow";

export interface EditExerciseModalProps extends Omit<ModalProps, "children"> {
  onSave: (name: string, categories: string[]) => void;
  onDelete: () => void;
  name: string;
  categories: string[];
}

export function EditExerciseModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  name: initialName,
  categories: initialCategories,
}: EditExerciseModalProps) {
  const [name, setName] = useState(initialName);
  const [categories, setCategories] = useState<Selection>(
    new Set(initialCategories)
  );
  const handleSave = () => {
    onSave(name, Array.from(categories) as string[]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader className="pt-3 px-2">Edit Exercise</ModalHeader>
        <ModalBody className="p-2">
          <Input
            size="sm"
            fullWidth
            variant="flat"
            label="Exercise"
            value={name}
            onValueChange={setName}
          />
          <ExerciseCategorySelect
            selectedCategories={categories}
            onCategoriesChange={setCategories}
            fullWidth
          />
        </ModalBody>
        <ModalFooter className="p-2">
          <IconButton variant="flat" onPress={onDelete}>
            <TrashIcon size={16} />
          </IconButton>
          <Grow />
          <Button
            size="sm"
            variant="flat"
            radius="lg"
            color="primary"
            startContent={<PlusIcon size={16} />}
            disabled={!name}
            onPress={handleSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
