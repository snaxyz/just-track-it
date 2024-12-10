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
import { KeyboardEventHandler, useCallback, useState } from "react";

interface SelectedExercise extends Pick<ExerciseModel, "id" | "name"> {
  isDraft?: boolean;
}

export interface CreateWorkoutModalProps extends Omit<ModalProps, "children"> {
  exercises: SelectedExercise[];
  onCreate: (input: {
    name: string;
    description: string;
    selectedExercises: SelectedExercise[];
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
  const [newExercise, setNewExercise] = useState("");
  const [draftExercises, setDraftExercises] = useState<SelectedExercise[]>([]);
  const handleCreateDraftExercise = useCallback((name: string) => {
    const exercise = {
      id: name.replace(/\s/g, "").toLowerCase(),
      name,
      categories: [],
    };
    setDraftExercises((e) => [...e, exercise]);
    setSelectedExercises((e) => new Set([...e, exercise.id]));
  }, []);
  const selectableExercises = exercises.concat(...draftExercises);

  const handleCreate = () => {
    const selectedIds = Array.from(selectedExercises) as string[];
    onCreate({
      name,
      description,
      selectedExercises: selectableExercises.filter((e) =>
        selectedIds.includes(e.id)
      ),
    });

    onClose?.();
    setName("");
    setDescription("");
    setSelectedExercises(new Set([]));
    setDraftExercises([]);
    setNewExercise("");
  };

  const handleNewExerciseKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    const exerciseName = newExercise.trim();
    if (!exerciseName) return;
    switch (e.key) {
      case "Enter": {
        const existingExercise = selectableExercises.find(
          (e) => e.name.toLowerCase() === exerciseName.toLowerCase()
        );
        if (!existingExercise) {
          setNewExercise("");
          return handleCreateDraftExercise(exerciseName);
        }
        const alreadySelected = Array.from(selectedExercises).includes(
          exerciseName.toLowerCase()
        );
        if (!alreadySelected) {
          setSelectedExercises((e) => new Set([...e, existingExercise.id]));
        }
        setNewExercise("");
      }
    }
  };

  const isValid = name && Array.from(selectedExercises).length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="pt-3 px-2">Create Workout</ModalHeader>
        <ModalBody className="p-2">
          <Input
            label="Name"
            placeholder="Workout name"
            fullWidth
            value={name}
            onValueChange={setName}
            size="sm"
            radius="lg"
          />
          <Textarea
            label="Description"
            placeholder="1 - 3 sets, 5-8 reps."
            fullWidth
            value={description}
            onValueChange={setDescription}
            size="sm"
            minRows={1}
            radius="lg"
          />
          {selectableExercises.length > 0 && (
            <ExerciseSelect
              exercises={selectableExercises}
              selectedExercises={selectedExercises}
              onExercisesChange={setSelectedExercises}
              fullWidth
            />
          )}
          <Input
            size="sm"
            radius="lg"
            label="New exercise"
            placeholder="Add a new exercise"
            onKeyDown={handleNewExerciseKeyDown}
            value={newExercise}
            onValueChange={setNewExercise}
          />
        </ModalBody>
        <ModalFooter className="p-2">
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
