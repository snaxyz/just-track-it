import {
  Select,
  SelectItem,
  Chip,
  SelectedItems,
  Selection,
  SharedSelection,
} from "@nextui-org/react";

export interface Category {
  id: string;
  name: string;
}

const defaultCategories = [
  "Upper",
  "Lower",
  "Push",
  "Pull",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes (Butt)",
  "Calves",
  "Abs",
  "Obliques",
].map((c) => ({ id: c, name: c }));

interface Props {
  selectedCategories: Selection;
  onCategoriesChange: (keys: SharedSelection) => void;
}

export function ExerciseCategorySelect({
  selectedCategories,
  onCategoriesChange,
}: Props) {
  return (
    <Select
      classNames={{
        base: "max-w-xs",
        trigger: "min-h-12 py-2",
      }}
      size="sm"
      items={defaultCategories}
      label="Categories"
      variant="bordered"
      isMultiline={true}
      selectionMode="multiple"
      placeholder="Select categories"
      renderValue={(items: SelectedItems<Category>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key}>{item.data?.name}</Chip>
            ))}
          </div>
        );
      }}
      selectedKeys={selectedCategories}
      onSelectionChange={onCategoriesChange}
    >
      {(category) => (
        <SelectItem key={category.id} textValue={category.name}>
          {category.name}
        </SelectItem>
      )}
    </Select>
  );
}
