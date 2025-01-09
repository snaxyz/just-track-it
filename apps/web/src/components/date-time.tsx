import { format } from "date-fns";

type DateFormat = "friendly" | "iso" | "custom";

interface Props {
  iso?: string;
  formatType?: DateFormat;
  customFormat?: string; // Only for "custom" type
}

export function DateTime({
  iso,
  formatType = "friendly",
  customFormat,
}: Props) {
  const date = iso ? new Date(iso) : new Date();

  const formattedDate = (() => {
    switch (formatType) {
      case "friendly":
        return format(date, "PPP p"); // Friendly format (e.g., Aug 25, 2024 10:30 AM)
      case "iso":
        return date.toISOString(); // Default ISO format
      case "custom":
        return customFormat ? format(date, customFormat) : date.toISOString();
      default:
        return date.toISOString();
    }
  })();

  return <>{formattedDate}</>;
}
