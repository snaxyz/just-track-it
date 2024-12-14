import { ExerciseSelect } from "@/components/exercises";
import { ExerciseModel, WorkoutWithRelations } from "@local/db";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Input,
  Textarea,
  Selection,
} from "@nextui-org/react";
import { SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SelectedExercise extends Pick<ExerciseModel, "id" | "name"> {
  isDraft?: boolean;
}

export interface EditWorkoutModalProps extends Omit<ModalProps, "children"> {
  workout?: Pick<WorkoutWithRelations, "name" | "description" | "exercises">;
  exercises: SelectedExercise[];
  onSave: (input: {
    name: string;
    description: string;
    selectedExercises: SelectedExercise[];
  }) => void;
}

export function EditWorkoutModal({
  isOpen,
  onClose,
  workout,
  exercises,
  onSave,
}: EditWorkoutModalProps) {
  const [name, setName] = useState(workout?.name ?? "");
  const [description, setDescription] = useState(workout?.description ?? "");
  const [selectedExercises, setSelectedExercises] = useState<Selection>(
    new Set(workout?.exercises?.map((e) => e.exerciseId) ?? [])
  );

  useEffect(() => {
    setName(workout?.name ?? "");
    setDescription(workout?.description ?? "");
    setSelectedExercises(
      new Set(workout?.exercises?.map((e) => e.exerciseId) ?? [])
    );
  }, [workout?.name, workout?.description, workout?.exercises]);

  const [newExercise, setNewExercise] = useState("");
  const [draftExercises, setDraftExercises] = useState<SelectedExercise[]>([]);

  const handleCreateDraftExercise = useCallback((name: string) => {
    const exercise = {
      id: name.replace(/\s/g, "").toLowerCase(),
      name,
      isDraft: true,
    };
    setDraftExercises((e) => [...e, exercise]);
    setSelectedExercises((e) => new Set([...e, exercise.id]));
  }, []);

  const selectableExercises = exercises.concat(...draftExercises);

  const handleSave = () => {
    const selectedIds = Array.from(selectedExercises) as string[];
    onSave({
      name,
      description,
      selectedExercises: selectableExercises.filter((e) =>
        selectedIds.includes(e.id)
      ),
    });

    onClose?.();
    setDraftExercises([]);
    setNewExercise("");
  };

  const handleNewExerciseKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
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
          existingExercise.id
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
      isOpen={isOpen && Boolean(workout)}
      onClose={onClose}
      isDismissable={false}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="pt-3 px-2">Edit Workout</ModalHeader>
        <ModalBody className="p-2">
          <Input
            label="Name"
            placeholder="Workout name"
            fullWidth
            value={name}
            onValueChange={setName}
            radius="lg"
          />
          <Textarea
            label="Description"
            placeholder="1 - 3 sets, 5-8 reps."
            fullWidth
            value={description}
            onValueChange={setDescription}
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
            onPress={handleSave}
            disabled={!isValid}
            startContent={<SaveIcon size={16} />}
            radius="lg"
            color="primary"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
