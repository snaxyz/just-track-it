import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import {
  WorkoutHistoryExercise,
  WorkoutHistoryExerciseSet,
} from "@local/database";
import { SetSelect, RepSelect, WeightSelect } from "../common";
import { Grow } from "@/components/layout/grow";
import { DeleteIcon, TrashIcon } from "lucide-react";

interface EditWorkoutExerciseModalProps extends Omit<ModalProps, "children"> {
  id: string;
  name: string;
  sets: WorkoutHistoryExerciseSet[];
  onDeleteExercise: () => void;
  onUpdateSet: (
    set: number,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => void;
  onDeleteSet: (set: number) => void;
}

export function EditWorkoutExerciseModal({
  id,
  name,
  sets,
  onDeleteExercise,
  onUpdateSet,
  onDeleteSet,
  isOpen,
  onClose,
}: EditWorkoutExerciseModalProps) {
  const handleDeleteExercise = () => {
    // TODO: confirmation modal
    onDeleteExercise();
  };

  const handleUpdateSet = (
    set: number,
    updates: Partial<WorkoutHistoryExerciseSet>
  ) => {
    onUpdateSet(set, updates);
  };

  const handleDeleteSet = (set: number) => {
    if (set === 0) {
      return onDeleteExercise();
    }
    onDeleteSet(set);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="capitalize">{name}</ModalHeader>
        <ModalBody className="p-2">
          {sets.map((set, ind) => (
            <div key={ind} className="mb-2">
              <div className="text-caption text-xs mb-2">Set {ind + 1}</div>
              <div className="flex items-center gap-2">
                <RepSelect
                  reps={set.reps.toString()}
                  onChange={(reps) =>
                    handleUpdateSet(ind, {
                      reps: parseInt(reps),
                    })
                  }
                />
                {set.weight && set.unit && (
                  <WeightSelect
                    weight={set.weight?.toString()}
                    unit={set.unit}
                    onChange={(weight) =>
                      handleUpdateSet(ind, {
                        weight: parseFloat(weight),
                      })
                    }
                  />
                )}
                <Grow />
                <Button
                  size="sm"
                  onClick={() => handleDeleteSet(ind)}
                  isIconOnly
                  radius="lg"
                  variant="bordered"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter className="p-2">
          <Button
            color="danger"
            onClick={handleDeleteExercise}
            className="mr-auto"
            size="sm"
          >
            Delete exercise
          </Button>
          <Button onClick={onClose} size="sm">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
