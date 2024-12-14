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
        <ModalHeader className="pt-3 px-2">New Exercise</ModalHeader>
        <ModalBody className="p-2">
          <Input
            fullWidth
            variant="flat"
            label="Exercise"
            value={name}
            onValueChange={setName}
            isInvalid={Boolean(error)}
            errorMessage={error}
          />
          <ExerciseCategorySelect
            selectedCategories={categories}
            onCategoriesChange={setCategories}
            fullWidth
          />
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            variant="flat"
            radius="lg"
            color="primary"
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
