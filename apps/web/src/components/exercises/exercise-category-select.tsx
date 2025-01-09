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
  fullWidth?: boolean;
}

export function ExerciseCategorySelect({
  selectedCategories,
  onCategoriesChange,
  fullWidth,
}: Props) {
  return (
    <Select
      items={defaultCategories}
      label="Categories"
      variant="flat"
      isMultiline={true}
      selectionMode="multiple"
      placeholder="Select categories"
      fullWidth={fullWidth}
      renderValue={(items: SelectedItems<Category>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key} variant="flat">
                {item.data?.name}
              </Chip>
            ))}
          </div>
        );
      }}
      selectedKeys={selectedCategories}
      onSelectionChange={onCategoriesChange}
    >
      {(category: Category) => (
        <SelectItem key={category.id} textValue={category.name}>
          {category.name}
        </SelectItem>
      )}
    </Select>
  );
}
