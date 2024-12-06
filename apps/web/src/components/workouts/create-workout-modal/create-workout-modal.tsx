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
} from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export interface CreateWorkoutModalProps extends Omit<ModalProps, "children"> {
  exercises: ExerciseModel[];
  onCreate: (input: {
    name: string;
    description: string;
    selectedExercises: string[];
  }) => void;
}

const autocompleteInputProps = {
  classNames: {
    input: "capitalize",
  },
};

export function CreateWorkoutModal({
  isOpen,
  onClose,
  exercises,
  onCreate,
}: CreateWorkoutModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleCreate = () => {
    onCreate({
      name,
      description,
      selectedExercises,
    });

    onClose?.();
    setName("");
    setDescription("");
    setSelectedExercises([]);
  };

  const isValid = name && selectedExercises.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <ModalContent>
        <ModalHeader>Create Workout</ModalHeader>
        <ModalBody className="p-2">
          <Input
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="sm"
            variant="bordered"
          />
          <Textarea
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="sm"
            variant="bordered"
          />
          <Autocomplete
            label="Add Exercises"
            fullWidth
            defaultItems={exercises}
            selectedKeys={selectedExercises}
            onSelectionChange={(keys) =>
              setSelectedExercises(Array.from(keys) as string[])
            }
            allowsMultipleSelection
            inputProps={autocompleteInputProps}
            isClearable={false}
            variant="bordered"
          >
            {exercises.map((exercise) => (
              <AutocompleteItem
                key={exercise.id}
                value={exercise.id}
                className="capitalize"
              >
                {exercise.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            onClick={handleCreate}
            disabled={!isValid}
            startContent={<PlusIcon size={16} />}
            radius="lg"
            variant="flat"
            size="sm"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
