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
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ExerciseCategorySelect } from "./exercise-category-select";

export interface NewExerciseModalProps extends Omit<ModalProps, "children"> {
  onAdd: (name: string, categories: string[]) => void;
  error?: string;
}

export function NewExerciseModal({
  isOpen,
  onClose,
  onAdd,
  error,
}: NewExerciseModalProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Selection>(new Set([]));

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setCategories(new Set([]));
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>New Exercise</ModalHeader>
        <ModalBody className="p-2">
          <Input
            size="sm"
            fullWidth
            variant="bordered"
            label="Exercise"
            value={name}
            onValueChange={setName}
            isInvalid={Boolean(error)}
            errorMessage={error}
          />
          <ExerciseCategorySelect
            selectedCategories={categories}
            onCategoriesChange={setCategories}
          />
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            size="sm"
            variant="flat"
            radius="lg"
            startContent={<PlusIcon size={16} />}
            disabled={!name}
            onPress={() => onAdd(name, Array.from(categories) as string[])}
          >
            Add exercise
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
