import { ExerciseAutocomplete, ExerciseSelect } from "@/components/exercises";
import { ExerciseModel } from "@local/database";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Input,
  Textarea,
  Chip,
  Selection,
} from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";

export interface CreateWorkoutModalProps extends Omit<ModalProps, "children"> {
  exercises: ExerciseModel[];
  onCreate: (input: {
    name: string;
    description: string;
    selectedExercises: ExerciseModel[];
  }) => void;
}

export function CreateWorkoutModal({
  isOpen,
  onClose,
  exercises,
  onCreate,
}: CreateWorkoutModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Selection>(
    new Set([])
  );

  const handleCreate = () => {
    const selectedIds = Array.from(selectedExercises) as string[];
    onCreate({
      name,
      description,
      selectedExercises: exercises.filter((e) => selectedIds.includes(e.id)),
    });

    onClose?.();
    setName("");
    setDescription("");
    setSelectedExercises(new Set([]));
  };

  const isValid = name && Array.from(selectedExercises).length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader className="px-2">Create Workout</ModalHeader>
        <ModalBody className="p-2">
          <Input
            label="Name"
            fullWidth
            value={name}
            onValueChange={setName}
            size="sm"
            radius="lg"
          />
          <Textarea
            label="Description"
            fullWidth
            value={description}
            onValueChange={setDescription}
            size="sm"
            minRows={1}
            radius="lg"
          />
          <ExerciseSelect
            exercises={exercises}
            selectedExercises={selectedExercises}
            onExercisesChange={setSelectedExercises}
            fullWidth
          />
        </ModalBody>
        <ModalFooter className="p-2 justify-between">
          <Button
            variant="light"
            startContent={<PlusIcon size={16} />}
            size="sm"
            color="secondary"
          >
            New exercise
          </Button>
          <Button
            onPress={handleCreate}
            disabled={!isValid}
            startContent={<PlusIcon size={16} />}
            radius="lg"
            size="sm"
            color="primary"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
